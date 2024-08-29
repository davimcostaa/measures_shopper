import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createMeasureValidator = vine.compile(
  vine.object({
    measure_datetime: vine.date({ formats: { utc: true } }),
    measure_type: vine.string().trim().in(['WATER', 'GAS']),
    image: vine.string().trim().escape(),
    customer_code: vine.string().trim()
  })
)

export const patchMeasureValidator = vine.compile(
  vine.object({
    measure_uuid: vine.string().trim().uuid(),
    confirmed_value: vine.number().withoutDecimals().positive()
  })
)



vine.messagesProvider = new SimpleMessagesProvider({

})
