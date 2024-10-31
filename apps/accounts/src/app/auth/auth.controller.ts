import { AuthService } from './auth.service';
import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@accounts/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

  //  @Post('register')
    @RMQValidate()
    @RMQRoute(AccountRegister.topic)
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.authService.register(dto);
    }

  //  @Post('login')
    @RMQValidate()
    @RMQRoute(AccountLogin.topic)
    async login(@Body() {email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
        const {id} = await this.authService.validateUser(email, password);
        return this.authService.login(id as string);
    }

}