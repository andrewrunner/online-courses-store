import { UserEntity } from './entities/user.entity';
import { AccountUserCourses, AccountUserInfo } from '@accounts/contracts';
import {  Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './respositories/user.repository';


@Controller()
export class UserQueriesController {

    constructor(
        private readonly userRepository: UserRepository
    ) {}

    @RMQValidate()
    @RMQRoute(AccountUserInfo.topic)
    async userInfo(@Body() dto: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
        const user = await this.userRepository.findUserById(dto.id)
        const profile = new UserEntity(user).getUserPublicProfile();
        return {
            profile
        };
    }


    @RMQValidate()
    @RMQRoute(AccountUserCourses.topic)
    async userCourses(@Body() dto:AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
        const user = await this.userRepository.findUserById(dto.id)
        return {
            courses: user.courses
        };
    }
}