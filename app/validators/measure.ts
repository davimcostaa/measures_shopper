import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createMeasureValidator = vine.compile(
  vine.object({
    measure_datetime: vine.string().regex(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([+-]\d{2}:\d{2}|Z)?)$/,
    ),
    measure_type: vine.string().trim().in(['WATER', 'GAS']),
    image: vine.string().trim().escape(),
    customer_code: vine.string().trim()
  })
)



vine.messagesProvider = new SimpleMessagesProvider({
  'measure_datetime.regex': 'Please choose a username for your account',

})
