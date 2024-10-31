import { IJWTPayload } from '@accounts/interfaces';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(configService: ConfigService) {
        super({
            JwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate({id}:IJWTPayload) {
        return id;
    }

}