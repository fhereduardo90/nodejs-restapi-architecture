export type EmailType = {
  to: string
  subject: string
  text?: string
  html: string
  templateId?: string
  dynamicTemplateData?: Record<string, unknown>
  sendAt?: number
}
