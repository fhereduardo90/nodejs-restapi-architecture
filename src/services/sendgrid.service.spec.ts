import faker from 'faker'
import { sendEmail } from './sendgrid.service'

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          statusCode: 200,
          headers: {},
          body: '',
        },
      ]),
    ),
  }
})

describe('SendgridService', () => {
  describe('sendEmail', () => {
    it('should send a email', async () => {
      const spyConsole = jest
        .spyOn(console, 'log')
        .mockImplementation(jest.fn())

      const to = faker.internet.email()
      const text = faker.lorem.words(5)
      const subject = faker.lorem.word()

      const result = await sendEmail({ to, html: text, text, subject })

      expect(result).toBeUndefined()
      expect(spyConsole).toBeCalledWith([
        {
          statusCode: 200,
          headers: {},
          body: '',
        },
      ])
    })
  })
})
