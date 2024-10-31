import { IUser } from '@accounts/interfaces';
import {IsString} from 'class-validator';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace AccountChangeProfile {
    
    export const topic = 'account.change-profile.command';

    export class Request {
        @IsString()
        id:string;

        @IsString()
        user:Pick<IUser, 'displayName'>;
    }
    
    export class Response {
       
    }
}


