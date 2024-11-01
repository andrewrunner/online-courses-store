
import { Injectable } from "@nestjs/common";
import { UserRepository } from './respositories/user.repository';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from "./entities/user.entity";
import { IUser } from "@accounts/interfaces";
import { BuyCourseSaga } from "./sagas/buy-course.saga";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly rmqService: RMQService
    ) {}

    async changeProfile(user: Pick<IUser, 'displayName'>, id:string) {
        const findedUser = await this.userRepository.findUserById(id)
        if(!findedUser) {
            throw new Error('Пользователя не существует!');
        }

        const userEntity = new UserEntity(findedUser);
        userEntity.updateProfile(user.displayName);
        await this.userRepository.updateUser(userEntity);

        return {};
    }


    async buyCourse(userId:string, courseId:string) {
        
        const findedUser = await this.userRepository.findUserById(userId);
        if(!findedUser) {
            throw new Error('Пользователя не существует!')
        } 
        const userEntity = new UserEntity(findedUser);

        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const {user, paymentLink} = await saga.getState().pay();
        await this.userRepository.updateUser(user);

        return {
            paymentLink
        }
    }


    async checkPayment(userId:string, courseId:string) {
        
        const findedUser = await this.userRepository.findUserById(userId);
        if(!findedUser) {
            throw new Error('Пользователя не существует!')
        } 
        const userEntity = new UserEntity(findedUser);

        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const {user, status } = await saga.getState().checkPayment();
        await this.userRepository.updateUser(user);

        return {
            status
        }
    }



}