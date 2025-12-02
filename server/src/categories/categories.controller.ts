import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly prisma: PrismaService) { }

    // 전체 카테고리 목록 조회 API (GET /categories)
    @Get()
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
