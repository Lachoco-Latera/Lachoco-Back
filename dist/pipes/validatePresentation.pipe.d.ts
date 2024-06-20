import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class validatePresentation implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
