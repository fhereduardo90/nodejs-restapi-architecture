import { Unauthorized } from 'http-errors'
import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { prisma } from '../server'

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY as string,
    },
    async (jwtPayload, done) => {
      const token = await prisma.token.findUnique({
        where: {
          jti: jwtPayload.sub,
        },
        select: {
          user: { select: { uuid: true } },
        },
        rejectOnNotFound: false,
      })

      if (!token) {
        return done(new Unauthorized('Invalid credentials'), null)
      }

      return done(null, { uuid: token.user.uuid })
    },
  ),
)
