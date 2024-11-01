import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './respositories/user.repository';
import { UserCommandsController } from './user.commands.controller';
import { UserQueriesController } from './user.queries.controller';
import { UserEventEmitter } from './user.event-emitter';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema},
    ])
  ],
  providers: [UserRepository, UserEventEmitter, UserService],
  exports: [UserRepository],
  controllers: [UserCommandsController, UserQueriesController]
})
export class UserModule {}
