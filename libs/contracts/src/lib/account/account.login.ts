import {IsEmail, IsString} from 'class-validator';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace AccountLogin {
    
    export const topic = 'account.login.command';

    export class Request {
        
        @IsEmail()
        email:string;

        @IsString()
        password:string;
    }
    
    export class Response {
        constructor(
            public access_token:string
        ) {}
    }
}


