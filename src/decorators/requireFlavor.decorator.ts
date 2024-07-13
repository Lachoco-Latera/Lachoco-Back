import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductOrder } from 'src/order/dto/create-order.dto';

@ValidatorConstraint({ async: false })
export class PickedFlavorsConditional implements ValidatorConstraintInterface {
  validate(pickedFlavors: any, args: ValidationArguments) {
    const product = args.object as ProductOrder;
    // Comprobar si la categoría no es "tabletas"
    if (product.category !== 'tabletas') {
      return Array.isArray(pickedFlavors) && pickedFlavors.length > 0;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'pickedFlavors is required unless the category is "tabletas"';
  }
}
