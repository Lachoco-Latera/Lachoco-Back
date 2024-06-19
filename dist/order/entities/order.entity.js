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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const openapi = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const orderDetail_entity_1 = require("./orderDetail.entity");
var status;
(function (status) {
    status["PENDING"] = "PENDING";
    status["FINISHED"] = "FINISHED";
})(status || (status = {}));
let Order = class Order {
    constructor() {
        this.id = (0, uuid_1.v4)();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, default: (0, uuid_1.v4)() }, date: { required: true, type: () => Date }, status: { required: true, enum: status }, orderDetail: { required: true, type: () => require("./orderDetail.entity").OrderDetail }, user: { required: true, type: () => require("../../user/entities/user.entity").User } };
    }
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], Order.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: status, default: status.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => orderDetail_entity_1.OrderDetail, (orderDetail) => orderDetail.order),
    __metadata("design:type", orderDetail_entity_1.OrderDetail)
], Order.prototype, "orderDetail", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.orders),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)({
        name: 'orders',
    })
], Order);
//# sourceMappingURL=order.entity.js.map