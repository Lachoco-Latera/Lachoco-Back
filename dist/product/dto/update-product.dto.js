"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlavorDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_1 = require("./create-product.dto");
class updateFlavorDto extends (0, swagger_1.PickType)(create_product_dto_1.CreateProductDto, ['flavors']) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.updateFlavorDto = updateFlavorDto;
//# sourceMappingURL=update-product.dto.js.map