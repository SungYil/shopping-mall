import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // 상품 등록 API (POST /products)
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    // 상품 목록 조회 API (GET /products)
    // 예: /products?page=1&limit=10&categoryId=1
    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('categoryId') categoryId?: number,
    ) {
        return this.productsService.findAll(Number(page), Number(limit), categoryId ? Number(categoryId) : undefined);
    }

    // 상품 상세 조회 API (GET /products/:id)
    // 예: /products/1
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }
}
