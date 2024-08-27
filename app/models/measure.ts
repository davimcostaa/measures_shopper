import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as crypto from 'crypto'
import Customer from './customer.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Measure extends BaseModel {
  @column({ isPrimary: true })
  declare measureUuid: crypto.UUID

  @column()
  declare measureDatetime: string

  @column()
  declare measureType: string

  @column()
  declare hasConfirmed: boolean

  @column()
  declare imageUrl: string

  @column()
  declare customerCode: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(()=>Customer)
  declare customer: BelongsTo<typeof Customer>
}
