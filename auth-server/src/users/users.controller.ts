import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from './schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '새로운 사용자 생성' })
  @ApiResponse({ status: 201, description: '사용자 생성 성공' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    enum: UserRole,
    description: '역할별 필터링 (ADMIN, AUDITOR, OPERATOR, USER)' 
  })
  @ApiQuery({ 
    name: 'username', 
    required: false, 
    description: '사용자 이름으로 필터링' 
  })
  @ApiQuery({ 
    name: 'email', 
    required: false, 
    description: '이메일로 필터링' 
  })
  async findAll(
    @Query('role') role?: UserRole,
    @Query('username') username?: string,
    @Query('email') email?: string,
  ) {
     // 필터 조건이 하나라도 있는 경우
     if (role || username || email) {
      if (role && !Object.values(UserRole).includes(role)) {
        throw new BadRequestException('Invalid role');
      }
      return this.usersService.findWithFilters({ role, username, email });
    }

    // 필터링 조건이 없는 경우 모든 사용자 반환
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'ID로 사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자 조회 성공' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiResponse({ status: 200, description: '사용자 정보 수정 성공' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 