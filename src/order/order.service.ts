import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order, status } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { OrderDetail } from './entities/orderDetail.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetailProduct } from './entities/orderDetailsProdusct.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { category } from 'src/category/entity/category.entity';
import { Address } from './entities/address.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { OrderDetailGiftCard } from './entities/orderDetailGiftCard.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderDetailProduct)
    private OrderDetailProductRepository: Repository<OrderDetailProduct>,
    @InjectRepository(OrderDetailGiftCard) private orderDetailGiftCardRepository: Repository<OrderDetailGiftCard>,
    @InjectRepository(Flavor)
    private flavorRepository: Repository<Flavor>,
    @InjectRepository(GiftCard) private giftCardRepository: Repository<GiftCard>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, products, giftCards } = createOrderDto;
    let total = 0;
    const errors = [];
    let findAllGiftCards: GiftCard[];
    let productsArr: Record<string, any>[];
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');


    if (giftCards && giftCards.length > 0) {
    findAllGiftCards = await Promise.all(
      giftCards.map(async (giftCard) => {
        const findGiftCard = await this.giftCardRepository.findOne({ where: { id: giftCard.giftCardId}})
        return findGiftCard;
      })
    )
    total += findAllGiftCards.reduce((acc, curr) => acc + curr.discount, 0);
  }

    const flavors = await this.flavorRepository.find();

    if (products && products.length > 0) {
    productsArr = await Promise.all(
      products.map(async (product) => {
        const findProduct = await this.productRepository.findOne({
          where: { id: product.productId },
          relations: { category: true },
        });
        //*si tiene 4 o mas productos de esta categoria da error
        if (
          findProduct.category.name === category.CAFES &&
          product.cantidad >= 4
        ) {
          errors.push(`Cannot chose more than 4 CAFES`);
        }
        const productInfo = { product: null, cantidad: 0 };

        if (!findProduct) {
          errors.push(`Product ${product.productId} not found`);
        } else {
          productInfo.product = findProduct;
          productInfo.cantidad = product.cantidad;
          total += Number(findProduct.price * product.cantidad);

          const filterFlavors = product.flavors?.map((pf) =>
            flavors.find((f) => f.id === pf.flavorId),
          );

          if (
            filterFlavors.includes(undefined) ||
            filterFlavors.length !== product.flavors.length
          ) {
            errors.push(`Un sabor seleccionado no disponible`);
          } else {
            await this.productRepository.save({
              ...findProduct,
              flavors: filterFlavors,
              orderDetailFlavors: product.flavors,
            });
            return { ...productInfo, pickedFlavors: product.pickedFlavors };
          }
        }
      }),
    );
  }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const order = {
      date: new Date(),
      user: user,
      additionalInfo: createOrderDto.additionalInfo,
    };

    const newOrder = await this.orderRepository.save(order);
    
    const orderDetail = {
      price: Number(total.toFixed(2)),
      order: newOrder,
    };
    
    const newOrderDetail = await this.orderDetailRepository.save(orderDetail);

    if (productsArr && productsArr.length > 0) {
      for (const { product, cantidad, pickedFlavors } of productsArr) {
        const orderDetailProduct = {
          orderDetail: newOrderDetail,
          product,
          cantidad,
          orderDetailFlavors: product.flavors,
          pickedFlavors,
        };
        await this.OrderDetailProductRepository.save(orderDetailProduct);
      }
    }

    if (findAllGiftCards && findAllGiftCards.length > 0) {
      for (const giftcard of findAllGiftCards){
        for (const data of giftCards) {
        const orderDetailGiftCard = {
          orderDetail: newOrderDetail,
          giftCard: giftcard,
          nameRecipient: data.nameRecipient,
          emailRecipient: data.emailRecipient,
          message: data.message,
        };
        await this.orderDetailGiftCardRepository.save(orderDetailGiftCard);
      }
      }
    }

    return await this.orderRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetail: {
          orderDetailProducts: {
            product: true,
            orderDetailFlavors: true,
          },
          orderDetailGiftCards: {
            giftCard: true,
          },
        },
      },
    });
  }

  async confirmOrder(orderId) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'user',
        'orderDetail',
        'orderDetail.orderDetailProducts',
        'orderDetail.orderDetailProducts.product',
      ],
    });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const orderDetailProducts = order.orderDetail.orderDetailProducts;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const orderDetailProduct of orderDetailProducts) {
        const product = orderDetailProduct.product;
        const cantidad = orderDetailProduct.cantidad;

        // if (cantidad && product) {
        //   await transactionalEntityManager.update(
        //     Product,
        //     { id: product.id },
        //     { stock: product.stock - cantidad },
        //   );
        // }
      }

      await transactionalEntityManager.update(
        Order,
        { id: order.id },
        { status: status.FINISHED },
      );

      return `order ${order.id} updated`;
    });
  }
  async findAll(pagination?: PaginationQuery) {
    const defaultPage = pagination?.page || 1;
    const defaultLimit = pagination?.limit || 15;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const orders = await this.orderRepository.find({
      relations: {
        orderDetail: {
          orderDetailProducts: {
            product: { category: true, images: true },
            orderDetailFlavors: true,
          },
          orderDetailGiftCards:{
            giftCard: true,
          }
        },
        user: true,
        giftCard: true,
        labels: true,
      },
    });

    const sliceOrders = orders.slice(startIndex, endIndex);
    return sliceOrders;
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        orderDetail: {
          orderDetailProducts: {
            product: { category: true, images: true },
          },
          orderDetailGiftCards: {
            giftCard: true,
          }
        },
        giftCard: { product: true },
        labels: true,
        address: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  async ordersFinished() {
    const orders = await this.orderRepository.find({
      relations: {
        orderDetail: {
          orderDetailProducts: {
            product: { category: true },
            orderDetailFlavors: true,
          },
        },
        user: true,
        giftCard: true,
      },
    });

    return orders.filter((o) => o.status === status.FINISHED);
  }

  async ordersFinishedByUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const getOrdersFinished = await this.ordersFinished();
    return getOrdersFinished.filter((o) => o.user.id === userId);
  }
  async update(id: string, updateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['orderDetail', 'orderDetail.orderDetailProducts'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const { userId, products, additionalInfo } = updateOrderDto;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      order.user = user;
    }

    if (additionalInfo) {
      order.additionalInfo = additionalInfo;
    }

    if (products) {
      let total = 0;
      const errors = [];
      const flavors = await this.flavorRepository.find();

      const productsArr = await Promise.all(
        products.map(async (product) => {
          const findProduct = await this.productRepository.findOne({
            where: { id: product.productId },
            relations: { category: true },
          });

          if (
            findProduct.category.name === category.CAFES &&
            product.cantidad >= 4
          ) {
            errors.push(`Cannot choose more than 4 CAFES`);
          }
          const productInfo = { product: null, cantidad: 0 };

          if (!findProduct) {
            errors.push(`Product ${product.productId} not found`);
          } else {
            productInfo.product = findProduct;
            productInfo.cantidad = product.cantidad;
            total += Number(findProduct.price * product.cantidad);

            const filterFlavors = product.flavors?.map((pf) =>
              flavors.find((f) => f.id === pf.flavorId),
            );

            if (
              filterFlavors.includes(undefined) ||
              filterFlavors.length !== product.flavors.length
            ) {
              errors.push(`Un sabor seleccionado no disponible`);
            } else {
              await this.productRepository.save({
                ...findProduct,
                flavors: filterFlavors,
                orderDetailFlavors: product.flavors,
              });
              return { ...productInfo, pickedFlavors: product.pickedFlavors };
            }
          }
        }),
      );

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      order.orderDetail.price = Number(total.toFixed(2));
      await this.orderDetailRepository.save(order.orderDetail);

      await this.OrderDetailProductRepository.remove(
        order.orderDetail.orderDetailProducts,
      );

      for (const { product, cantidad, pickedFlavors } of productsArr) {
        const orderDetailProduct = {
          orderDetail: order.orderDetail,
          product,
          cantidad,
          orderDetailFlavors: product.flavors,
          pickedFlavors,
        };
        await this.OrderDetailProductRepository.save(orderDetailProduct);
      }
    }

    return this.orderRepository.save(order);
  }
  async cancelOrder(id: string, cancelByUserId: string) {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) throw new NotFoundException('Order not found');
    const userCancel = await this.userRepository.findOne({
      where: { id: cancelByUserId },
    });
    if (!userCancel) throw new NotFoundException('user not found');

    await this.orderRepository.update(
      { id: order.id },
      {
        status: status.CANCELLED,
        cancelByUserId: userCancel.id,
      },
    );

    return `This order ${order.id} has been canceled by ${userCancel.id}`;
  }

  async remove(id: string): Promise<string> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id },
      relations: ['orderDetail', 'orderDetail.orderDetailProducts'],
    });

    const affectedProductIds = order.orderDetail.orderDetailProducts.map(
      (product) => product.id,
    );

    await this.orderRepository.remove(order);

    return `Se ha eliminado el pedido con ID ${id} y fueron afectados los productos con IDs: ${affectedProductIds.join(
      ', ',
    )}`;
  }
}
