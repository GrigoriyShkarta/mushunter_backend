import * as process from 'process';

export default (): any => {
	return {
		port: process.env.PORT,
		database_url: process.env.DATABASE_URL,
		jwt_key: process.env.JWT_SECRET,
		google_client_id: process.env.GOOGLE_CLIENT_ID,
		google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
		google_callback_url: process.env.GOOGLE_CALLBACK_URL,
		google_mail: process.env.GOOGLE_MAIL,
		google_password: process.env.GOOGLE_PASSWORD,
	};
};
