import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class TokenDto {
  @Expose()
  readonly accessToken: string

  @Expose()
  readonly exp: number
}
