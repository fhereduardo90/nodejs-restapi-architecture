import { Unauthorized } from 'http-errors'
import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { prisma } from '../prisma'

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
          user: { select: { uuid: true, email: true } },
          admin: { select: { uuid: true, email: true, role: true } },
        },
        rejectOnNotFound: false,
      })

      if (!token) {
        return done(new Unauthorized('Invalid credentials'), null)
      }

      const user = token.user
        ? { ...token.user, type: 'user' }
        : { ...token.admin, type: 'admin' }

      // this will pass in the user object only with the uuid property to the request object
      return done(null, {
        user,
      })
    },
  ),
)
