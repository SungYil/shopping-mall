import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    /**
     * 리뷰 작성
     * @param req 요청 객체 (유저 정보 포함)
     * @param createReviewDto 리뷰 데이터
     */
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(req.user.userId, createReviewDto);
    }

    /**
     * 상품별 리뷰 목록 조회
     * @param productId 상품 ID
     */
    @Get('product/:productId')
    findAllByProduct(@Param('productId', ParseIntPipe) productId: number) {
        return this.reviewsService.findAllByProduct(productId);
    }
}
