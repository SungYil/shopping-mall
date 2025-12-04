export class CreateReviewDto {
    content: string;
    rating: number;
    productId: number;
    images?: string[];
}
