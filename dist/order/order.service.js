"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const typeorm_2 = require("typeorm");
const pagination_1 = require("../utils/pagination");
const orderDetail_entity_1 = require("./entities/orderDetail.entity");
const user_entity_1 = require("../user/entities/user.entity");
const product_entity_1 = require("../product/entities/product.entity");
const orderDetailsProdusct_entity_1 = require("./entities/orderDetailsProdusct.entity");
let OrderService = class OrderService {
    constructor(orderRepository, orderDetailRepository, userRepository, productRepository, OrderDetailProductRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.OrderDetailProductRepository = OrderDetailProductRepository;
    }
    async create(createOrderDto) {
        const { userId, products } = createOrderDto;
        let total = 0;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const productsArr = await Promise.all(products.map(async (product) => {
            const findProduct = await this.productRepository.findOneBy({
                id: product.id,
            });
            const productInfo = { product: null, cantidad: 0 };
            if (!findProduct) {
                return productInfo;
            }
            else if (findProduct.stock === 0) {
                return productInfo;
            }
            else if (findProduct.stock < product.cantidad) {
                return productInfo;
            }
            else {
                productInfo.product = findProduct;
                productInfo.cantidad = product.cantidad;
                total += Number(findProduct.price * product.cantidad);
                await this.productRepository.update({ id: findProduct.id }, { stock: findProduct.stock - product.cantidad });
                return productInfo;
            }
        }));
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
            };
            await this.OrderDetailProductRepository.save(orderDetailProduct);
        }
        return await this.orderRepository.find({
            where: { id: newOrder.id },
            relations: {
                orderDetail: {
                    orderDetailProducts: {
                        product: true,
                    },
                },
            },
        });
    }
    async findAll(pagination) {
        const { page, limit } = pagination;
        const orders = await this.orderRepository.find();
        const sliceOrders = (0, pagination_1.fnPagination)(page, limit, orders);
        return sliceOrders;
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({ where: { id: id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    update(id, updateOrderDto) {
        return `This action updates a #${id} order`;
    }
    remove(id) {
        return `This action removes a #${id} order`;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(orderDetail_entity_1.OrderDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(4, (0, typeorm_1.InjectRepository)(orderDetailsProdusct_entity_1.OrderDetailProduct)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map