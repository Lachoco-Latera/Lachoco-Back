import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class validatePresentation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value.category);
    if (value.category === 'bombas') {
      const validPresentaciones = [6, 2];
      if (!validPresentaciones.includes(value.presentacion)) {
        throw new BadRequestException(
          `Presentación no válida para la categoría "bombas". Debe ser uno de los siguientes valores: ${validPresentaciones.join(', ')}`,
        );
      }
    }
    if (value.category === 'bombones') {
      const validPresentaciones = [48, 24, 12];
      if (!validPresentaciones.includes(value.presentacion)) {
        throw new BadRequestException(
          `Presentación no válida para la categoría "bombones". Debe ser uno de los siguientes valores: ${validPresentaciones.join(', ')}`,
        );
      }
    }
    if (value.category === 'tabletas' || value.category === 'cafes') {
      const validPresentaciones = [1];
      if (!validPresentaciones.includes(value.presentacion)) {
        throw new BadRequestException(
          `Presentación no válida para la categoría "tabletas","cafes". Debe ser uno de los siguientes valores: ${validPresentaciones.join(', ')}`,
        );
      }
    }

    return value;
  }
}
