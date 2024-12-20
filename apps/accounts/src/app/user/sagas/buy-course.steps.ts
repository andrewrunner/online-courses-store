import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from "@accounts/contracts";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { PurchaseState } from "@accounts/interfaces";



export class BuyCourseSagaStateStarted extends BuyCourseSagaState {

	public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {

		const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
			id: this.saga.courseId
		});

		if (!course) {
			throw new Error('Курса не существует!');
		}

		if (course.price == 0) {
			this.saga.setPurchaseState(PurchaseState.Purchased, course._id);
			return { 
                paymentLink: null, 
                user: this.saga.user 
            };
		}

		const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
			courseId: course._id,
			userId: this.saga.user._id as string,
			sum: course.price 
		});

		this.saga.setPurchaseState(PurchaseState.WaitingForPayment, course._id);

		return { 
            paymentLink, 
            user: this.saga.user 
        };
	}

	public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
		throw new Error('Нельзя проверить платёж, который не начался!');
	}

	public async cencel(): Promise<{ user: UserEntity; }> {
		this.saga.setPurchaseState(PurchaseState.Cenceled, this.saga.courseId);
		return { 
            user: this.saga.user 
        };
	}
}



export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
    
	public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		throw new Error('Нельзя создать ссылку на оплату в процессе!');
	}

	public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {

		const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
			userId: this.saga.user._id as string,
			courseId: this.saga.courseId
		});

		if (status ===  'canceled') {
			this.saga.setPurchaseState(PurchaseState.Cenceled, this.saga.courseId);
			return { 
                user: this.saga.user, 
                status: 'canceled' 
            };
		}

		if (status === 'success') {
			return { 
                user: this.saga.user, 
                status: 'success' 
            };
		}

		this.saga.setPurchaseState(PurchaseState.Purchased, this.saga.courseId);
		return { 
            user: this.saga.user, 
            status: 'in-progress' 
        };
	}

	public cencel(): Promise<{ user: UserEntity; }> {
		throw new Error('Нельзя отменить платёж в процессе!');
	}
}


export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {

	public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		throw new Error('Нельзя оплатить купленный курс!');
	}

	public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
		throw new Error('Нельзя проверить платёж по купленному курсу!');
	}

	public cencel(): Promise<{ user: UserEntity; }> {
		throw new Error('Нельзя отменить купленный курс!');
	}
}


export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {

	public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		this.saga.setPurchaseState(PurchaseState.Started, this.saga.courseId);
		return this.saga.getState().pay();
	}

	public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
		throw new Error('Нельзя проверить платёж по отменённому курсу!');
	}

	public cencel(): Promise<{ user: UserEntity; }> {
		throw new Error('Нельзя отменить откменённый курс!');
	}
}