import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { label, Product, statusExp } from './entities/product.entity';
import { LessThan, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { Category } from 'src/category/entity/category.entity';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { Cron } from '@nestjs/schedule';
import { Order } from 'src/order/entities/order.entity';
import {
  frecuency,
  statusSubs,
  SuscriptionPro,
} from 'src/suscription/entity/suscription.entity';
import { User } from 'src/user/entities/user.entity';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { CreateShipmentDto } from 'src/shipments/dto/create-shipment.dto';
import { UpdateShipmentDto } from 'src/shipments/dto/update-shipment.dto';
import { OrderLabel } from 'src/order/entities/label.entity';
import { EmailService } from 'src/email/email.service';
import { bodyOrderAdmin } from 'src/user/emailBody/bodyOrderAdmin';
import { transporter } from 'src/utils/transportNodemailer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Flavor) private flavorRepository: Repository<Flavor>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(OrderDetailProduct)
    private readonly orderDetailProductRepository: Repository<OrderDetailProduct>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(SuscriptionPro)
    private readonly suscriptionProRepository: Repository<SuscriptionPro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrderLabel)
    private readonly orderLabelRepository: Repository<OrderLabel>,
    private shipmentsService: ShipmentsService,
    private emailService: EmailService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!findCategory)
      throw new NotFoundException(
        `Category ${createProductDto.categoryId} not found`,
      );

    const imageEntities = createProductDto.images.map((imageUrl) =>
      this.imageRepository.create({ img: imageUrl }),
    );
    const savedImages = await this.imageRepository.save(imageEntities);
    const { categoryId, ...saveProduct } = createProductDto;

    // Manejar la creación de los sabores
    const flavorEntities = createProductDto.flavors.map((flavor) => ({
      id: flavor.id,
      name: flavor.name,
      stock: flavor.stock,
    }));

    const newProduct = {
      ...saveProduct,
      category: findCategory,
      images: savedImages,
      flavors: flavorEntities,
    };

    return await this.productRepository.save(newProduct);
  }

  async findAll(pagination?: PaginationQuery) {
    const defaultPage = pagination?.page || 1;
    const defaultLimit = pagination?.limit || 15;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const products = await this.productRepository.find({
      relations: { flavors: true, images: true, category: true },
    });
    const sliceUsers = products.slice(startIndex, endIndex);
    return sliceUsers;
  }

  async findOne(id: string) {
    const findProdut = await this.productRepository.findOne({
      where: { id: id },
      relations: ['flavors', 'images', 'category'],
    });
    if (!findProdut) throw new NotFoundException('Product not found');

    return findProdut;
  }

  async relatedProducts(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { category: true },
    });

    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    const allProducts = await this.productRepository.find({
      relations: { category: true },
    });
    const relatedProducts = allProducts.filter(
      (p) => p.category.id === product.category.id,
    );
    return relatedProducts;
  }

  async updateFlavor(id: string, updateFlavorDto) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { flavors: true },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    const existingFlavors = findProduct.flavors.map((flavor) => flavor.name);
    const flavorsToAdd = updateFlavorDto.flavor.filter(
      (flavor) => !existingFlavors.includes(flavor),
    );
    if (flavorsToAdd.length > 0) {
      const flavorsToAddEntities = flavorsToAdd.map((name) => ({ name: name }));
      await this.flavorRepository.save(flavorsToAddEntities);
      findProduct.flavors = [...findProduct.flavors, ...flavorsToAddEntities];
      await this.productRepository.save(findProduct);
    }

    return findProduct;
  }

  async removeFlavor(id: string, updateFlavorDto) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { flavors: true },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    const flavorsToRemove = findProduct.flavors.filter((flavor) =>
      updateFlavorDto.flavor.includes(flavor.name),
    );

    if (flavorsToRemove.length > 0) {
      await this.flavorRepository.remove(flavorsToRemove);
      findProduct.flavors = findProduct.flavors.filter(
        (flavor) => !flavorsToRemove.includes(flavor),
      );
    }
    await this.productRepository.save(findProduct);
    return findProduct;
  }

  async inactiveProduct(id: string) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { flavors: true },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    await this.productRepository.update(findProduct.id, {
      isActive: false,
    });
    return `Product ${id} change to inactive`;
  }
  async remove(id: string): Promise<string> {
    const findProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['orderDetailProducts', 'images', 'flavors'],
    });

    if (!findProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Elimina las relaciones con OrderDetailProducts si existen
    if (findProduct.orderDetailProducts?.length > 0) {
      await this.orderDetailProductRepository.remove(
        findProduct.orderDetailProducts,
      );
    }

    // Elimina las imágenes si existen
    if (findProduct.images?.length > 0) {
      await this.imageRepository.remove(findProduct.images);
    }

    // Elimina el producto
    await this.productRepository.remove(findProduct);

    return `Se ha eliminado el producto correspondiente`;
  }

  async update(id: string, updateProductDto): Promise<Product> {
    // Encuentra el producto por su ID y carga las imágenes relacionadas
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { flavors: true, images: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Actualiza los detalles del producto (excepto imágenes)
    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.price) product.price = updateProductDto.price;
    // ...actualiza otros campos según sea necesario

    // Maneja las imágenes nuevas
    if (updateProductDto.images) {
      // Primero, guarda las nuevas imágenes
      const newImageEntities = updateProductDto.images.map((imageUrl) =>
        this.imageRepository.create({ img: imageUrl }),
      );
      const savedImages = await this.imageRepository.save(newImageEntities);

      // Asocia las nuevas imágenes al producto
      product.images = [...product.images, ...savedImages];
    }

    // Maneja sabores si es necesario
    if (updateProductDto.flavors) {
      const flavorEntities = updateProductDto.flavors.map((flavor) => ({
        id: flavor.id,
        name: flavor.name,
        stock: flavor.stock,
      }));
      product.flavors = flavorEntities;
    }

    return this.productRepository.save(product);
  }

  async findExpiredProducts() {
    const now = new Date();
    return this.productRepository.find({
      where: {
        expiryDate: LessThan(now),
        status: statusExp.ACTIVATED,
      },
    });
  }

  async findExpiredSusbcriptions() {
    const now = new Date();
    return this.suscriptionProRepository.find({
      where: {
        date_finish: LessThan(now),
      },
      relations: { user: true },
    });
  }

  async updateProductStatus(productId: string, status: statusExp) {
    await this.productRepository.update(productId, { status });
  }

  @Cron('0 0 * * *')
  async handleCron() {
    console.log('soy el cron');
    const expiredProducts = await this.findExpiredProducts();
    const expiredSusbcriptions = await this.findExpiredSusbcriptions();

    for (const susbcriptions of expiredSusbcriptions) {
      const user = await this.userRepository.findOne({
        where: { id: susbcriptions.user.id },
        relations: { orders: true, suscriptionPro: true },
      });
      await this.suscriptionProRepository.update(
        { id: susbcriptions.id },
        { status: statusSubs.EXPIRED },
      );
      //*subscription en order a null
      await this.orderRepository.update(
        { anySubscription: user.suscriptionPro.id.toString() },
        { anySubscription: 'NoSubscription' },
      );
    }

    for (const product of expiredProducts) {
      await this.updateProductStatus(product.id, statusExp.EXPIRED);
    }
  }

  @Cron('0 8 * * *')
  async montly() {
    console.log('mensual');
    const users = await this.userRepository.find({
      relations: {
        suscriptionPro: true,
        orders: { address: true },
      },
    });
    const frecuencyUsers = users
      .filter((u) => u.suscriptionPro.frecuency === frecuency.MONTHLY)
      .filter((subs) => subs.suscriptionPro.status === statusSubs.ACTIVATED);

    for (const user of frecuencyUsers) {
      const orders = user.orders;
      if (!orders || orders.length === 0) continue;

      for (const order of orders) {
        const currentDate = new Date().toISOString();
        const date7_days = new Date(order.date_7days).toISOString();
        const date14_days = new Date(order.date_14days).toISOString();
        const date21_days = new Date(order.date_21days).toISOString();
        const date28_days = new Date(order.date_28days).toISOString();

        if (
          date7_days === currentDate ||
          date14_days === currentDate ||
          date21_days === currentDate ||
          date28_days === currentDate
        ) {
          // const newlabel =
          //await this.shipmentsService.createLabel(dateShipments);
          // const parseLabel = JSON.parse(newlabel);
          // const { label, trackingNumber } = parseLabel.data[0];
          // const saveLabel = new OrderLabel();
          // saveLabel.label = label;
          // saveLabel.trackingNumber = trackingNumber;
          // saveLabel.order = order;
          // await this.orderLabelRepository.save(saveLabel);
        }
      }
    }
  }

  @Cron('0 7 * * *')
  async weekly() {
    console.log('semanal');
    const users = await this.userRepository.find({
      relations: {
        suscriptionPro: true,
        orders: { labels: true },
      },
    });
    const frecuencyUsers = users
      .filter((u) => u.suscriptionPro.frecuency === frecuency.WEEKLY)
      .filter((subs) => subs.suscriptionPro.status === statusSubs.ACTIVATED);
    for (const user of frecuencyUsers) {
      const orders = user.orders;
      if (!orders || orders.length === 0) continue;
      console.log(orders);
      for (const order of orders) {
        const currentDate = new Date().toISOString();
        const date2_days = new Date(order.date_2days).toISOString();
        const date4_days = new Date(order.date_4days).toISOString();
        const date6_days = new Date(order.date_6days).toISOString();
        const date8_days = new Date(order.date_8days).toISOString();

        if (
          date2_days === currentDate ||
          date4_days === currentDate ||
          date6_days === currentDate ||
          date8_days === currentDate
        ) {
          const template = bodyOrderAdmin(
            'ventas_lachoco_latera@hotmail.com',
            'Orden de envio',
            order,
            currentDate,
          );
          const info = await transporter.sendMail({
            from: '"Lachoco-latera" <ventas_lachoco_latera@hotmail.com>', // sender address
            to: 'ventas_lachoco_latera@hotmail.com', // list of receivers
            subject: 'Envios pendientes por subscripcion', // Subject line
            text: 'Nueva Orden de envio', // plain text body
            html: template, // html body
          });
          console.log('Message sent: %s', info.messageId);
          // const mail = {
          //   to: 'ventas@lachoco-latera.com',
          //   subject: 'Orden de envio',
          //   text: 'Nueva Orden de envio',
          //   template: template,
          // };
          // await this.emailService.sendPostulation(mail);
          // const newlabel =
          //  // await this.shipmentsService.createLabel(dateShipments);
          // const parseLabel = JSON.parse(newlabel);
          // const { label, trackingNumber } = parseLabel.data[0];
          // const saveLabel = new OrderLabel();
          // saveLabel.label = label;
          // saveLabel.trackingNumber = trackingNumber;
          // saveLabel.order = order;
          // await this.orderLabelRepository.save(saveLabel);
        }
      }
    }
  }
}
