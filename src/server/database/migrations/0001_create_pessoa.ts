import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(ETableNames.pessoa, table => {
            table.bigIncrements('id').primary().index();
            table.string('nome', 150).checkLength('<=', 150).index().notNullable();
            table.string('email', 150).checkLength('<=', 150).unique().notNullable();
            table.bigInteger('cidadeId').index().notNullable().references('id').inTable(ETableNames.cidade).onUpdate('CASCADE').onDelete('RESTRICT');

            table.comment('Tabela utilizada para armazenar pessoas do sistema.');
        }).then(() => {
            console.log(`# Created Table ${ETableNames.pessoa}`);
        });
}


export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(ETableNames.pessoa)
        .then(() => {
            console.log(`# Dropped Table ${ETableNames.pessoa}`);
        });
}