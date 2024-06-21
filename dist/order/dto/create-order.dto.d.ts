export declare class FlavorOrderDTO {
    flavorId: string;
    cantidad: number;
}
export declare class ProductOrder {
    productId: string;
    cantidad: number;
    flavors: FlavorOrderDTO[];
}
export declare class CreateOrderDto {
    userId: string;
    products: ProductOrder[];
}
