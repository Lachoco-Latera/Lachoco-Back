import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class validateFlavors implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let total = 0;
    if (value.category === 'bombas') {
      for (const flavor of value.flavors) {
        total = total + flavor.cantidad;
      }
      if (total !== 6 && total !== 2) {
        throw new BadRequestException(
          `Debe introducir de 6, 2 cantidades de sabor totales`,
        );
      }
    } else if (value.category === 'bombones') {
      for (const flavor of value.flavors) {
        total = total + flavor.cantidad;
      }
      if (total !== 48 && total !== 24 && total !== 12) {
        throw new BadRequestException(
          `Debe introducir de 48, 24,12 cantidades de sabor totales`,
        );
      }
    } else if (value.category === 'tabletas') {
      for (const flavor of value.flavors) {
        total = total + flavor.cantidad;
      }
      if (total !== 1) {
        throw new BadRequestException(
          `Debe introducir de 1 cantidad de sabor total`,
        );
      }
    }

    return value;
  }
}
