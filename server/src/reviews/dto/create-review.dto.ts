export class CreateReviewDto {
    content: string;
    rating: number;
    productId: number;
    images?: string[];
    purchasedOption?: string;
    userHeight?: number;
    userWeight?: number;
    userTopSize?: string;
    userBottomSize?: string;
}
