import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async createOrder(userId: number) {
        // 1. 장바구니 조회
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('장바구니가 비어있습니다.');
        }

        // 2. 총 주문 금액 계산
        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        // 3. 주문 생성 (트랜잭션)
        return this.prisma.$transaction(async (tx) => {
            // 재고 확인 및 감소
            for (const item of cart.items) {
                if (item.product.stock < item.quantity) {
                    throw new BadRequestException(`상품 ${item.product.name}의 재고가 부족합니다.`);
                }
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // 주문 생성
            const order = await tx.order.create({
                data: {
                    userId,
                    total,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
                include: { items: true },
            });

            // 장바구니 비우기 (장바구니 아이템 삭제)
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            return order;
        });
    }

    async findAll(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: number, orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('주문을 찾을 수 없습니다.');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('본인의 주문만 조회할 수 있습니다.');
        }

        return order;
    }

    // 관리자용: 모든 주문 조회
    async findAllForAdmin() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true },
                },
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // 관리자용: 주문 상태 변경
    async updateStatus(id: number, status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status: status as any },
        });
    }
}
