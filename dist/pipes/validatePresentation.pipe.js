"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePresentation = void 0;
const common_1 = require("@nestjs/common");
let validatePresentation = class validatePresentation {
    transform(value, metadata) {
        if (value.category === 'bombas') {
            const validPresentaciones = [6, 2];
            if (!validPresentaciones.includes(value.presentacion)) {
                throw new common_1.BadRequestException(`Presentación no válida para la categoría "bombas". Debe ser uno de los siguientes valores: ${validPresentaciones.join(', ')}`);
            }
        }
        else if (value.category === 'bombones') {
            const validPresentaciones = [48, 24, 12];
            if (!validPresentaciones.includes(value.presentacion)) {
                throw new common_1.BadRequestException(`Presentación no válida para la categoría "bombones". Debe ser uno de los siguientes valores: ${validPresentaciones.join(', ')}`);
            }
        }
        else if (value.category === 'tabletas') {
            const validPresentaciones = [1];
            if (!validPresentaciones.includes(value.presentacion)) {
                throw new common_1.BadRequestException(`Presentación no válida para la categoría "tabletas". Debe ser uno de los siguientes valores: ${validPresentaciones.join(', ')}`);
            }
        }
        return value;
    }
};
exports.validatePresentation = validatePresentation;
exports.validatePresentation = validatePresentation = __decorate([
    (0, common_1.Injectable)()
], validatePresentation);
//# sourceMappingURL=validatePresentation.pipe.js.map