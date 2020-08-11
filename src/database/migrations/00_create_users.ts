import Knex from 'knex';

export async function up(knex: Knex){
    //faz alteracoes no banco
    return knex.schema.createTable('users', table => {
        //campo autoincrement
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.string('whatsapp').notNullable();
        table.string('bio').notNullable();
    })
}

export async function down(knex: Knex){
    //desfaz alteracoes no banco 
    return knex.schema.dropTable('users');
}