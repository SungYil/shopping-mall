import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    /**
     * 상품 생성
     * @param createProductDto 상품 생성에 필요한 데이터 (이름, 설명, 가격 등)
     */
    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    /**
     * 상품 목록 조회 (페이징 및 카테고리 필터링)
     * @param page 현재 페이지 번호 (기본값: 1)
     * @param limit 페이지당 상품 수 (기본값: 10)
     * @param categoryId 카테고리 ID (선택 사항)
     */
    async findAll(page: number = 1, limit: number = 10, categoryId?: number) {
        // 건너뛸 개수 계산 (1페이지면 0, 2페이지면 10...)
        const skip = (page - 1) * limit;

        // 검색 조건 설정 (카테고리 ID가 있으면 조건에 추가)
        const where = categoryId ? { categoryId } : {};

        // Promise.all로 전체 개수(count)와 데이터 조회(findMany)를 동시에 실행
        const [total, products] = await Promise.all([
            this.prisma.product.count({ where }),
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }, // 최신순 정렬
                include: { category: true },    // 카테고리 정보도 함께 가져오기
            }),
        ]);

        // 메타 데이터(전체 개수, 페이지 정보)와 함께 반환
        return {
            data: products,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
            },
        };
    }

    /**
     * 상품 상세 조회
     * @param id 조회할 상품 ID
     */
    async findOne(id: number) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true }, // 카테고리 정보 포함
        });
    }
}
