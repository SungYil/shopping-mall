import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // 상품 등록 API (POST /products) - 관리자 권한 필요
    @UseGuards(AuthGuard('jwt'), AdminGuard)
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

    // 상품 수정 API (PUT /products/:id) - 관리자 권한 필요
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    // 상품 삭제 API (DELETE /products/:id) - 관리자 권한 필요
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}
