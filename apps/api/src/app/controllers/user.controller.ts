import { Controller, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';


@Controller('user')
export class UserController {

    @UseGuards(JWTAuthGuard)
    @Post('info')
    async register(@UserId() userId: string) {

        console.log(userId);
        return {} 
    }

}