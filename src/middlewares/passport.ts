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
      const user = await prisma.user.findUnique({
        where: {
          uuid: jwtPayload.sub,
        },
        rejectOnNotFound: false,
      })

      if (!user) {
        return done(new Unauthorized('Invalid credentials'), null)
      }

      return done(null, { uuid: user.uuid })
    },
  ),
)
