import { Expose, Exclude } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { BaseDto } from '../../base.dto'

@Exclude()
export class UpdateUserDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName: string

  @Expose()
  @IsEmail()
  @IsOptional()
  readonly email: string

  @Expose()
  @IsString()
  @Length(6, 20)
  @IsOptional()
  readonly password: string
}
