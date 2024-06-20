declare class ProductOrder {
    id: string;
    cantidad: number;
}
export declare class CreateOrderDto {
    userId: string;
    products: ProductOrder[];
}
export {};
