import { UserEntity } from './entities/user.entity';
import {  Body, Controller } from '@nestjs/common';
import { UserRepository } from './respositories/user.repository';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@accounts/contracts';


@Controller()
export class UserCommandsController {

    constructor(
        private readonly userRepository: UserRepository
    ) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async userInfo(@Body() { user, id }:AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
        const findedUser = await this.userRepository.findUserById(id)
        if(!findedUser) {
            throw new Error('Пользователя не существует!');
        }

        const userEntity = new UserEntity(findedUser);
        userEntity.updateProfile(user.displayName);
        await this.userRepository.updateUser(userEntity);

        return {};
    }
}