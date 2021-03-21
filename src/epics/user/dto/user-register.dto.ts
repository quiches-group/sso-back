import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  mail: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;
}
