import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseGuards(AuthGuard('jwt'), AdminGuard) // 1. 로그인(JWT) 확인 -> 2. 관리자 권한(AdminGuard) 확인
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // 관리자 대시보드 통계 조회 API
    // GET /admin/dashboard
    @Get('dashboard')
    getDashboard() {
        return this.adminService.getDashboardStats();
    }
}
