import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@accounts/contracts';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() {email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
        const {id} = await this.authService.validateUser(email, password);
        return this.authService.login(id as string);
    }

}