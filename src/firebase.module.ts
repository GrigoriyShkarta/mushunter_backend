import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from './firebase.service';

const firebaseProvider = {
	provide: 'FIREBASE_APP',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const firebaseConfig = {
			apiKey: 'AIzaSyAXJmfmjNOgFfJ0lmIEyFmAPSGTZKL2XfQ',
			authDomain: 'mushunter-11a47.firebaseapp.com',
			projectId: 'mushunter-11a47',
			storageBucket: 'mushunter-11a47.appspot.com',
			messagingSenderId: '904087062857',
			appId: '1:904087062857:web:54325812de69c709f63298',
		} as admin.ServiceAccount;

		return admin.initializeApp({
			credential: admin.credential.cert(firebaseConfig),
			databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
			storageBucket: `${firebaseConfig.projectId}.appspot.com`,
		});
	},
};

@Module({
	imports: [ConfigModule],
	providers: [firebaseProvider],
	exports: [FirebaseRepository],
})
export class FirebaseModule {}
