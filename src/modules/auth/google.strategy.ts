import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			clientID: configService.get('google_client_id'),
			clientSecret: configService.get('google_client_secret'),
			callbackURL: configService.get('google_callback_url'),
			scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		// console.log('accessToken', accessToken);
		// console.log('refreshToken', refreshToken);
		// console.log('profile', profile);
		// const { name, emails, photos } = profile;
		// const user = {
		// 	email: emails[0].value,
		// 	firstname: name.givenName,
		// 	lastname: name.familyName,
		// 	avatar: photos[0].value,
		// 	accessToken,
		// 	refreshToken,
		// };
		done(null, profile);
	}
}
