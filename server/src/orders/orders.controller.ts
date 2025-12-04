import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { OrdersService } from './orders.service';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Request() req) {
        return this.ordersService.createOrder(req.user.userId);
    }

    @Get()
    findAll(@Request() req) {
        return this.ordersService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOne(req.user.userId, id);
    }

    // 관리자용: 전체 주문 목록 조회
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get('admin/all')
    findAllForAdmin() {
        return this.ordersService.findAllForAdmin();
    }

    // 관리자용: 주문 상태 변경
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        return this.ordersService.updateStatus(id, status);
    }
}
