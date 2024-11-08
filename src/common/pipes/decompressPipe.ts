import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as zlib from 'zlib';

@Injectable()
export class DecompressPipe implements PipeTransform {
	transform(value: Buffer, metadata: ArgumentMetadata) {
		if (value) {
			try {
				const decompressed = zlib.inflateSync(value);
				return JSON.parse(decompressed.toString());
			} catch (error) {
				console.error('Decompression error:', error.message);
				throw new BadRequestException('Invalid compressed data');
			}
		}
	}
}
