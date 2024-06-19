import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class ConfirmPass implements ValidatorConstraintInterface {
    validate(password: string, arg: ValidationArguments): boolean;
    defaultMessage(arg: ValidationArguments): string;
}
