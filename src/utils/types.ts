export type EmailType = {
  to: string
  subject: string
  text?: string
  html: string
  templateId?: string
  dynamicTemplateData?: Record<string, unknown>
  sendAt?: number
}

export type Authenticated<T> = {
  user: T & { type: 'user' | 'admin' }
}
