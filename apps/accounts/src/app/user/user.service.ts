
import { Injectable } from "@nestjs/common";
import { UserRepository } from './respositories/user.repository';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from "./entities/user.entity";
import { IUser } from "@accounts/interfaces";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmitter } from "./user.event-emitter";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly rmqService: RMQService,
        private readonly userEventEmitter: UserEventEmitter
    ) {}

    async changeProfile(user: Pick<IUser, 'displayName'>, id:string) {
        const findedUser = await this.userRepository.findUserById(id)
        if(!findedUser) {
            throw new Error('Пользователя не существует!');
        }

        const userEntity = new UserEntity(findedUser);
        userEntity.updateProfile(user.displayName);
        await this.updateUser(userEntity);

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
        await this.updateUser(user);

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
        await this.updateUser(user);

        return {
            status
        }
    }


    private updateUser(user:UserEntity) {
        return Promise.all([
            this.userEventEmitter.handle(user),
            this.userRepository.updateUser(user),
        ])

    }
}