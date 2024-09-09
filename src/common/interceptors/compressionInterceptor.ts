import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import * as pako from 'pako';

@Injectable()
export class CompressionInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				if (data) {
					const compressedData = pako.deflate(JSON.stringify(data));
					return { compressedData };
				}
				return data;
			}),
		);
	}
}
