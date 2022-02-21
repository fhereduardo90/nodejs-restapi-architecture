import { Admin, User } from '@prisma/client'

export type EmailType = {
  to: string
  subject: string
  text?: string
  html: string
  templateId?: string
  dynamicTemplateData?: Record<string, unknown>
  sendAt?: number
}

export type Authenticated = {
  user: (Admin | User) & { type: 'user' | 'admin' }
}
