import { Agenda } from 'agenda'

export const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URL as string,
    collection: 'jobs',
  },
})
