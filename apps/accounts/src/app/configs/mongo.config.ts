import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
    return {
        useFactory: (configService: ConfigService) => ({
			uri: getMongoString(configService),
		}),
        inject: [ConfigService],
        imports: [ConfigModule],
    }
}

const getMongoString = (configService: ConfigService) => {
	return 'mongodb://' +
		configService.get('MONGO_LOGIN', 'admin') +
		':' +
		configService.get('MONGO_PASSWORD', 'admin') +
		'@' +
		configService.get('MONGO_HOST', 'localhost') +
		':' +
		configService.get('MONGO_PORT', '27017') +
		'/' +
		configService.get('MONGO_DATABASE', 'courses') +
		'?authSource=' +
		configService.get('MONGO_AUTHDATABASE', 'admin') 
};