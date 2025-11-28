import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt')) // 로그인한 사용자만 접근 가능
export class CartController {
    constructor(private readonly cartService: CartService) { }

    // 내 장바구니 조회
    @Get()
    getCart(@Request() req) {
        return this.cartService.getCart(req.user.userId);
    }

    // 장바구니 담기
    @UseGuards(AuthGuard('jwt'))
    @Post()
    addToCart(@Req() req, @Body() createCartItemDto: CreateCartItemDto) {
        console.log('POST /cart called');
        console.log('User:', req.user);
        console.log('Body:', createCartItemDto);
        return this.cartService.addToCart(req.user.userId, createCartItemDto);
    }

    // 수량 변경
    @Patch('items/:id')
    updateCartItem(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(req.user.userId, id, updateCartItemDto);
    }

    // 삭제
    @Delete('items/:id')
    removeCartItem(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.cartService.removeCartItem(req.user.userId, id);
    }
}
