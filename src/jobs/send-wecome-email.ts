import { JobAttributesData } from 'agenda'
import { agenda } from '../agenda'

agenda.define(
  'send-welcome-email',
  { priority: 100, concurrency: 5 },
  async (job: JobAttributesData) => {
    const { email } = job.attrs.data
    console.log(`Hello ${email}`)
  },
)

agenda.start().catch(console.error)
