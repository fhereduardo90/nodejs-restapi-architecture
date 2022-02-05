import { Expose, Exclude } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

@Exclude()
export class LoginDto extends BaseDto {
  @Expose()
  @IsEmail()
  readonly email: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly password: string
}
