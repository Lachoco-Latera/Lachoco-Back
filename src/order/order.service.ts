import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order, status } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { OrderDetail } from './entities/orderDetail.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetailProduct } from './entities/orderDetailsProdusct.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { OrderDetailFlavor } from './entities/flavorDetail.entity';

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
    @InjectRepository(OrderDetailFlavor)
    private orderDetailFlavorRepository: Repository<OrderDetailFlavor>,
    @InjectRepository(Flavor)
    private flavorRepository: Repository<Flavor>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, products } = createOrderDto;
    let total = 0;
    const errors = [];
    const orderFlavor = [];
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const flavors = await this.flavorRepository.find();

    const productsArr = await Promise.all(
      products.map(async (product) => {
        const findProduct = await this.productRepository.findOneBy({
          id: product.productId,
        });

        const productInfo = { product: null, cantidad: 0 };

        if (!findProduct) {
          errors.push(`Product ${product.productId} not found`);
        } else {
          productInfo.product = findProduct;
          productInfo.cantidad = product.cantidad;
          total += Number(findProduct.price * product.cantidad);

          const filterFlavors = product.flavors.map((pf) =>
            flavors.find((f) => f.id === pf.flavorId),
          );

          if (
            filterFlavors.includes(undefined) ||
            filterFlavors.length !== product.flavors.length
          ) {
            errors.push(`Un sabor seleccionado no disponible`);
          } else {
            product.flavors.forEach((pf) => {
              const flavor = flavors.find((f) => f.id === pf.flavorId);
              if (flavor) {
                orderFlavor.push({
                  cantidad: pf.cantidad,
                  flavor: flavor,
                });
              }
            });

            await this.productRepository.save({
              ...findProduct,
              flavors: filterFlavors,
              orderDetailFlavors: product.flavors,
            });
            return productInfo;
          }
        }
      }),
    );

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const order = {
      date: new Date(),
      user: user,
    };

    const newOrder = await this.orderRepository.save(order);

    const orderDetail = {
      price: Number(total.toFixed(2)),
      order: newOrder,
    };

    const newOrderDetail = await this.orderDetailRepository.save(orderDetail);

    for (const { product, cantidad } of productsArr) {
      const orderDetailProduct = {
        orderDetail: newOrderDetail,
        product,
        cantidad,
        orderDetailFlavors: orderFlavor,
      };
      await this.OrderDetailProductRepository.save(orderDetailProduct);
    }

    return await this.orderRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetail: {
          orderDetailProducts: {
            product: true,
            orderDetailFlavors: true,
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
    const { page, limit } = pagination ?? {};
    const defaultPage = page ?? 1;
    const defaultLimit = limit ?? 15;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const orders = await this.orderRepository.find({
      relations: { orderDetail: true },
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
            product: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
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
