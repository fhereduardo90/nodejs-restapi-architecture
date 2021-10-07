import { Expose, Exclude } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { BaseDto } from '../../base.dto'

@Exclude()
export class CreateUserDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string

  @Expose()
  @IsEmail()
  readonly email: string

  @Expose()
  @IsString()
  @Length(6, 20)
  readonly password: string
}
