import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'measures'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('measure_uuid').primary()
      table.dateTime('measure_datetime').notNullable()
      table.string('measure_type', 10).notNullable()
      table.boolean('has_confirmed').nullable()
      table.string('image_url').notNullable()
      table.string('customer_code').unsigned().references('customer_code').inTable('customers')


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
