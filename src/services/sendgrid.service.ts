import sgMail from '@sendgrid/mail'
import { EmailType } from '../utils/types'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

async function sendEmail(data: EmailType): Promise<void> {
  sgMail.send({ ...data, from: process.env.SENDGRID_SENDER_EMAIL || '' }).then(
    (body) => {
      // eslint-disable-next-line no-console
      console.log(body)
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.error(error)
    },
  )
}

export { sendEmail }
