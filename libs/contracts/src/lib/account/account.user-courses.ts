import { IUserCourses } from '@accounts/interfaces';
import {IsString} from 'class-validator';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace AccountUserCourses {
    
    export const topic = 'account.user-courses.query';

    export class Request {
        @IsString()
        id:string;
    }
    
    export class Response {
       courses: IUserCourses[]
    }
}

