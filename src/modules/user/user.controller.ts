import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
}
