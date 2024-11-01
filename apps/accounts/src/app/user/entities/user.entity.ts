import { AccountChangedCourse } from "@accounts/contracts";
import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from "@accounts/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {

    _id?: unknown;
    displayName?: string;
    email:string;
    passwordHash:string;
    role: UserRole;
	courses: IUserCourses[];
	events: IDomainEvent[] = [];

    constructor(user:IUser) {
        this._id = user._id;
		this.passwordHash = user.passwordHash;
		this.displayName = user.displayName;
		this.email = user.email;
		this.role = user.role;
		this.courses = user.courses;
    }


	public getUserPublicProfile() {
		return {
			email: this.email,
			role: this.role,
			displayName: this.displayName
		}
	}

    public async setPassword(password: string) {
		const salt = await genSalt(10);
		this.passwordHash = await hash(password, salt);
		return this;
	}

	public validatePassword(password: string) {
		return compare(password, this.passwordHash);
	}

	public updateProfile(displayName: string) {
		this.displayName = displayName;
		return this;
	}



	// public addCourse(courseId: string) {
	// 	const isExists = this.courses.find((course) => course._id === courseId);
	// 	if(!isExists) {
	// 		throw new Error('Такой курс уже существует!')
	// 	}
	// 	this.courses.push({
	// 		courseId,
	// 		purchaseState: PurchaseState.Started
	// 	})
	// }

	// public deleteCourse(courseId: string) {
	// 	this.courses = this.courses.filter((course) => course._id !== courseId);
	// }

	public setCourseStatus(courseId:string, state:PurchaseState) {
		const isExists = this.courses.find((course) => course._id === courseId);
		if(!isExists) {
			this.courses.push({
				courseId,
				purchaseState: state
			});
			return this;
		}

		if(state === PurchaseState.Cenceled) {
			this.courses = this.courses.filter((course) => course._id !== courseId);
			return this;
		}

		this.courses = this.courses.map((course) => {
			if(course._id === courseId) {
				course.purchaseState = state;
			}
			return course;
		})

		this.events.push({
			topic: AccountChangedCourse.topic,
			data: {
				courseId,
				userId: this._id,
				state
			}
		});

		return this;
	}

}