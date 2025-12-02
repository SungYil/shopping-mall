import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    // 대시보드에 필요한 핵심 통계 데이터를 모아서 반환합니다.
    async getDashboardStats() {
        // Promise.all을 사용하여 병렬로 데이터를 조회합니다. (속도 향상)
        const [totalOrders, totalSales, totalUsers, totalProducts] = await Promise.all([
            this.prisma.order.count(), // 총 주문 건수
            this.prisma.order.aggregate({
                _sum: { total: true }, // 총 매출액 (total 컬럼의 합)
            }),
            this.prisma.user.count(), // 총 회원 수
            this.prisma.product.count(), // 총 상품 수
        ]);

        // 최근 들어온 주문 5개를 최신순으로 조회합니다.
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }, // 주문자 정보도 함께 가져옵니다.
        });

        return {
            totalOrders,
            totalSales: totalSales._sum.total || 0, // 매출이 없으면 0원 처리
            totalUsers,
            totalProducts,
            recentOrders,
        };
    }
}
