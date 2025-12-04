import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    /**
     * 리뷰 생성
     * @param userId 작성자 ID
     * @param createReviewDto 리뷰 데이터 (내용, 별점, 상품ID, 이미지)
     */
    async create(userId: number, createReviewDto: CreateReviewDto) {
        return this.prisma.review.create({
            data: {
                ...createReviewDto,
                userId,
            },
            include: {
                user: {
                    select: {
                        name: true, // 작성자 이름 포함
                    },
                },
            },
        });
    }

    /**
     * 상품별 리뷰 목록 조회
     * @param productId 상품 ID
     */
    async findAllByProduct(productId: number) {
        return this.prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' }, // 최신순 정렬
            include: {
                user: {
                    select: {
                        name: true, // 작성자 이름 포함
                    },
                },
            },
        });
    }
}
