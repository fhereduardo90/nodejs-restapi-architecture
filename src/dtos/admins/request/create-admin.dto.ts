import { AdminRole } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class CreateAdminDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly fullName: string

  @IsEmail()
  readonly email: string

  @IsString()
  @Length(6, 20)
  readonly password: string

  @IsEnum(AdminRole)
  readonly role: AdminRole
}
