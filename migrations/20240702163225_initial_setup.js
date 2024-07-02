// migrations/YYYYMMDDHHMMSS_initial_setup.js
exports.up = function(knex) {
    return knex.schema
      .createTable('family_members', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('age').notNullable();
        table.date('date_of_birth').notNullable();
        table.date('date_of_death');
        table.string('image');
        table.text('description');
      })
      .createTable('parent_child_relationships', table => {
        table.increments('id').primary();
        table.integer('parent_id').references('id').inTable('family_members');
        table.integer('child_id').references('id').inTable('family_members');
      })
      .createTable('spouse_relationships', table => {
        table.increments('id').primary();
        table.integer('spouse1_id').references('id').inTable('family_members');
        table.integer('spouse2_id').references('id').inTable('family_members');
      })
      .createTable('traditions_customs', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.string('media');
      })
      .createTable('events', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.date('date').notNullable();
        table.string('media');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTable('events')
      .dropTable('traditions_customs')
      .dropTable('spouse_relationships')
      .dropTable('parent_child_relationships')
      .dropTable('family_members');
  };
  