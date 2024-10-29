
export interface IUser {
    _id?: unknown;
    displayName?: string;
    email:string;
    passwordHash:string;
    role: UserRole;
}

export enum UserRole {
    Teasher = 'Teacher',
    Student = 'Student',
}