import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    // 장바구니 조회 (없으면 생성)
    async getCart(userId: number) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }

        return cart;
    }

    // 장바구니 담기
    async addToCart(userId: number, dto: CreateCartItemDto) {
        const cart = await this.getCart(userId);

        // 이미 장바구니에 있는 상품인지 확인
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: dto.productId,
            },
        });

        if (existingItem) {
            // 이미 있으면 수량 추가
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        } else {
            // 없으면 새로 생성
            return this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                },
            });
        }
    }

    // 장바구니 아이템 수량 수정
    async updateCartItem(userId: number, cartItemId: number, dto: UpdateCartItemDto) {
        const cart = await this.getCart(userId);

        // 내 장바구니의 아이템인지 확인
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: cartItemId,
                cartId: cart.id,
            },
        });

        if (!item) {
            throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다.');
        }

        return this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity: dto.quantity },
        });
    }

    // 장바구니 아이템 삭제
    async removeCartItem(userId: number, cartItemId: number) {
        const cart = await this.getCart(userId);

        // 내 장바구니의 아이템인지 확인
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: cartItemId,
                cartId: cart.id,
            },
        });

        if (!item) {
            throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다.');
        }

        return this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
    }
}
