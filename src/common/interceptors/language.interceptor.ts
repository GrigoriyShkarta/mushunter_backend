import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
	constructor(private readonly i18n: I18nService) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const request = context.switchToHttp().getRequest();
		request.language = request.headers['accept-language'] || 'ua';

		return next.handle();
	}
}
