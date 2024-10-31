export enum UserRole {
    Teasher = 'Teacher',
    Student = 'Student',
}

export enum PurchaseState {
    Started = 'Started',
    WaitingForPayment = 'WaitingForPayment',
    Purchased = 'Purchased',
    Cenceled = 'Cenceled',
}



export interface IUser {
    _id?: unknown;
    displayName?: string;
    email:string;
    passwordHash:string;
    role: UserRole;
    courses?: IUserCourses[]
}

export interface IUserCourses {
    _id?: unknown;
    courseId: string;
    purchaseState: PurchaseState
}