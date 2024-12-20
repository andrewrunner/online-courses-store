import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { PurchaseState } from "@accounts/interfaces";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStateCanceled, BuyCourseSagaStatePurchased, BuyCourseSagaStateStarted, BuyCourseSagaStateWaitingForPayment } from "./buy-course.steps";

export class BuyCourseSaga {

    private state:BuyCourseSagaState;

    constructor(
        public user:UserEntity, 
        public courseId:string,
        public rmqService:RMQService
    ) {
        this.setPurchaseState(user.getCourseState(courseId), courseId);
     }

    public getState() {
        return this.state;
    }

    public setPurchaseState(state:PurchaseState, courseId:string) {
        switch(state) {
            case PurchaseState.Started:
                this.state = new BuyCourseSagaStateStarted();
                break;
            case PurchaseState.WaitingForPayment:
                this.state = new BuyCourseSagaStateWaitingForPayment();
                 break;
            case PurchaseState.Purchased:
                this.state = new BuyCourseSagaStatePurchased();
                break;
            case PurchaseState.Cenceled:
                this.state = new BuyCourseSagaStateCanceled();
                break;
        }

        this.state.setContext(this);
        this.user.setCourseStatus(courseId, state);
    }


}