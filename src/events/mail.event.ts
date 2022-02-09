import { sendEmail } from '../services/sendgrid.service'
import { UsersService } from '../services/users.service'

export const USER_EMAIL_CONFIRMATION = Symbol('USER_EMAIL_CONFIRMATION')

type userEmailConfirmationType = {
  email: string
  userUUID: string
}

export async function userEmailConfirmationEvent({
  email,
  userUUID,
}: userEmailConfirmationType): Promise<void> {
  const token = UsersService.generateEmailConfirmationToken(userUUID)

  try {
    await sendEmail({
      to: email,
      subject: 'Confirm Account',
      text: 'please confirm your email',
      html: `<strong>Token: ${token}</strong>`,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
