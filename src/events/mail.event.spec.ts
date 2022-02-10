import faker from 'faker'
import { SendgridService } from '../services/sendgrid.service'
import { userEmailConfirmationEvent } from './mail.event'

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

describe('userEmailConfirmationEvent', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('should be logger the error if something goes wrong with send email', async () => {
    jest
      .spyOn(SendgridService, 'sendEmail')
      .mockImplementation(jest.fn(() => Promise.reject('some error')))

    const spyConsole = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn())

    await userEmailConfirmationEvent({
      email: faker.internet.email(),
      userUUID: faker.datatype.uuid(),
    })

    expect(spyConsole).toBeCalledWith('some error')
  })

  it('should send the email confirmation', async () => {
    jest
      .spyOn(SendgridService, 'sendEmail')
      .mockImplementation(jest.fn(() => Promise.resolve()))

    const result = await userEmailConfirmationEvent({
      email: faker.internet.email(),
      userUUID: faker.datatype.uuid(),
    })

    const spyConsole = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn())

    expect(result).toBeUndefined()
    expect(spyConsole).toHaveBeenCalledTimes(0)
  })
})
