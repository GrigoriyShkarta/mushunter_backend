import { DynamicModule, Module } from '@nestjs/common';
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

			type: 'service_account',
			project_id: 'mushunter-11a47',
			private_key_id: '30f3a5323caed273707d06bf5cf4627e16fb8442',
			private_key:
				'-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDYhBoIbBI8Md8G\ns8LnZuhCKNXC5yFaSlh8iCjJrq5phW5cwWs0rf4ZNAjLDtd2AjerQsobo7GtEinS\n+y+aU3/YESkXp4p+bbcrIXLL3NxBfZvUiCDz0XZ0vWpwxxYgbCTZ1E236I0Mcl7n\nqoRKvcfmHaKvyM4Na5QjlinSNSeNqvSEfKmvNKlm0ROy2a1N60AaPF+q78AmIsub\nSe4WbO1zmvVJGXL/bV438Lg6EajP5Cgm5Xq8g6j03IiDDCUtMMKN+S84/kojVRYk\nk3NOXGpmTShc70vkVXjqAYcX2KDPdJLeOe0o6OrkQFHpmbrJlwDnM68EeyjmTi6w\nBlx9GuaXAgMBAAECggEAOY8g1pVYYa1GY6M9UMQgQZpWfYpxaO3zySNvaHJqRn4k\n4T7AL9CDiRK2tbi72dDsGLjYPvHNBbwa505EkOvaxEeHm5S8MjEbrTkmqgCMg1KP\nrzgDPp40NgO2/MVIYhUt1MTmZlpJyQHMrhy8L5x1PH0rZzzkXlf3mWBNvObJnZTU\nSmhdTHTSCusw1QNADmcGplPbwkbBZ88CGWdGqlpvhc3uGK4W03U+S28aa99jcGZR\ng549KDOKll0FCVUooOLlYS+KZqF00St1JKHiFD5f9RXUKatCtTZWApxMV4tGCGev\nHJuFI0iWoFsN+MovsY0bn6IXIWx7eo7lHR3tYrWfjQKBgQD0Msb/R7K8f1IC0eXz\n9DDWzVS/QGAsdpAr/YCeftBZcl6zNBml6S2IclYtbnJOVY7sOKpf/IwYSRZ0V8mu\nSgRFwT/6UejaWfDUwGztYzmXRn1GSH9+cxRBWeKtvN8kU+ffiQ1n4n3CdSEJiNxv\naUTFnlaj2GKqdCVFV5GZGZ8tvQKBgQDi+taqHtS9IblM7bv7kK5iQcgV4BDRy3/R\nJmFcFlfDJVaet2uHCMY2SNOmsQ8lOzDJrHr+6eR3a96YutfRigbvGbCf0YXdqBO8\nrUmnCx/xGZIE7QPKlbsoBJPp+8mVd26k+QVSW21bIMIiiWT4oCGblU3SIZ4RY51t\n+F3N7AQ44wKBgQDPdIPSQ5r4wEFv29m7UmxbT7z7bTlHDMKWXJp0C8/87Ui+fTh8\n1oe0L04+8mFxYwY0cD9tpCNwTkchN6NCyeavS+mKQyPKvDX4yDDBy1YVyfCLUPPe\n/OzsR+xnJNl9BzspkEkvRB8KoG8cpoR+sbOXH1kDgMTxghJXwnkS082DEQKBgQC7\nlzxbFWgVeA3BeqnmW8kEBAHtsmW0Pk/A98t3ZC/cZLuWKVmBHMtUihQCrEssJiNI\nSnjMvVnJKSmraKB92Wmpqr3DGFNewk6tnTpGCHe5t7xqvchoYh9wD3h/5UzRbwfO\n6NBxJIbYzdYk3RDKOu4Lu/W5OXd+P6oY/S/pxKooqQKBgQCKgnoYCVWDD0MpL7po\nk40tGz1n1Gi9fHVHWJg6fZMTRQ7RMgWpHKA737dzTgFon/+cQyxBoyOIHzXrkDTk\nkLBVGrVfVK7ErWjpuEy/Hng4U8jomy9WHcVRHldRUQmMeHZPJEFsLj7QAxI0Fay7\nvvyZMBlHcZLifsmUy6ASZwYn2w==\n-----END PRIVATE KEY-----\n',
			client_email: 'firebase-adminsdk-mqme0@mushunter-11a47.iam.gserviceaccount.com',
			client_id: '116204631140316544411',
			auth_uri: 'https://accounts.google.com/o/oauth2/auth',
			token_uri: 'https://oauth2.googleapis.com/token',
			auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
			client_x509_cert_url:
				'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mqme0%40mushunter-11a47.iam.gserviceaccount.com',
			universe_domain: 'googleapis.com',
		} as admin.ServiceAccount;

		if (!admin.apps.length) {
			return admin.initializeApp({
				credential: admin.credential.cert(firebaseConfig),
				databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
				storageBucket: `${firebaseConfig.projectId}.appspot.com`,
			});
		} else {
			return admin.app();
		}
	},
};

@Module({
	imports: [ConfigModule],
	providers: [firebaseProvider, FirebaseRepository],
	exports: [FirebaseRepository],
})
export class FirebaseModule {
	static forRoot(): DynamicModule {
		return {
			module: FirebaseModule,
			global: true, // Это делает модуль глобальным
		};
	}
}
