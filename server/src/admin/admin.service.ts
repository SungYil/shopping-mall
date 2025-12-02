import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalOrders, totalSales, totalUsers, totalProducts] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                _sum: { total: true },
            }),
            this.prisma.user.count(),
            this.prisma.product.count(),
        ]);

        // 최근 주문 5개
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });

        return {
            totalOrders,
            totalSales: totalSales._sum.total || 0,
            totalUsers,
            totalProducts,
            recentOrders,
        };
    }
}
