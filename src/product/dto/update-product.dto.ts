import { PickType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class updateFlavorDto extends PickType(CreateProductDto, ['flavors']) {}
