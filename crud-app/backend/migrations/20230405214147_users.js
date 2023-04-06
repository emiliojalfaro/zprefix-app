/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema

    .createTable('users', (table) => {
      table.increments('id');
      table.string('first_name').notNullable;
      table.string('last_name').notNullable;
      table.string('username').notNullable;
      table.string('password').notNullable
    })

    .createTable('items', (table) => {
      table.increments('id');
      table.integer('user_id').references('users.id');
      table.string('item_name').notNullable;
      table.string('description').notNullable;
      table.integer('quantity').notNullable
    })
};
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */

  exports.down = function(knex) {
    return knex.schema
    .alterTable('items', table => {
      table.dropForeign('user_id')
    })
    .then(() => {
      knex.schema.dropTableIfExists('users')
    })
    .then(() => {
      knex.schema.dropTableIfExists('items')
    })
  };