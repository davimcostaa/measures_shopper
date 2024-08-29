import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createMeasureValidator = vine.compile(
  vine.object({
    measure_datetime: vine.date({ formats: { utc: true } }),
    measure_type: vine.string().trim().in(['WATER', 'GAS']),
    image: vine.string().trim().escape(),
    customer_code: vine.string().trim()
  })
)



vine.messagesProvider = new SimpleMessagesProvider({

})
