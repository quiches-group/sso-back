import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
