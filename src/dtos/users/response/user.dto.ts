import { Exclude, Expose, Transform } from 'class-transformer'

@Exclude()
export class UserDto {
  @Expose()
  readonly uuid: string

  @Expose()
  readonly firstName: string

  @Expose()
  readonly lastName: string

  @Expose()
  readonly email: string

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date
}
