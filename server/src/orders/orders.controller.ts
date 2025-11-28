import { Controller, Get, Post, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Req() req) {
        return this.ordersService.createOrder(req.user.userId);
    }

    @Get()
    findAll(@Req() req) {
        return this.ordersService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOne(req.user.userId, id);
    }
}
