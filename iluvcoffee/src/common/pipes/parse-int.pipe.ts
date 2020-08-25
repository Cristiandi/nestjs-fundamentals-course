import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`validation failed "${value}" is not an integer.`);
    }

    return val;
  }
}
