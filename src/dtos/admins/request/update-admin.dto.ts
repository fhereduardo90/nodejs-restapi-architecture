import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { BaseDto } from '../../base.dto'

export class UpdateAdminDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly fullName?: string

  @IsEmail()
  @IsOptional()
  readonly email?: string

  @IsString()
  @Length(6, 20)
  @IsOptional()
  readonly password?: string
}
