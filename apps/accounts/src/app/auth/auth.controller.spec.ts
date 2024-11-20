 import { Test, TestingModule } from '@nestjs/testing';
 import { ConfigModule } from '@nestjs/config';
 import { MongooseModule } from '@nestjs/mongoose';
 import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';

 import { UserModule } from '../user/user.module';
 import { getMongoConfig } from '../configs/mongo.config';
 import { AuthModule } from './auth.module';
 import { INestApplication } from '@nestjs/common';
 import { AccountLogin, AccountRegister } from '@accounts/contracts';
import  { Connection } from 'mongoose';


const authLogin: AccountLogin.Request = {
   email: 'test123@mail.com',
   password: '12345'
}

const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: 'Mike',
}



describe('AuthController test', () => {

    let app:INestApplication;
   // let userRepository:UserRepository;
    let rmqService:RMQTestService;
    let connection:Connection;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal:true, envFilePath: 'envs/.account.env' }),
                RMQModule.forTest({}),
                UserModule, 
                AuthModule,
                MongooseModule.forRootAsync(getMongoConfig()),
            ]
        }).compile();


        app = module.createNestApplication();
       // userRepository = app.get<UserRepository>(UserRepository)
        rmqService = app.get(RMQService)

        await app.init();

        connection = app.get<Connection>('DatabaseConnection');
    });


    it('Register', async () => {

        const response = await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(
            AccountRegister.topic, 
            authRegister
        );

        expect(response.email).toEqual(authRegister. email);
    });

    it('Login', async () => {

        const response = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
            AccountLogin.topic, 
            authLogin
        );

        expect(response.access_token).toBeDefined();
    });

    afterAll(async () => {
        //await userRepository.deleteUser(authRegister.email);
        await connection.db.dropDatabase();
        app.close();
    })

});
