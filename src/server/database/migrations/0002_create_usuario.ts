import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(ETableNames.usuario, table => {
            table.bigIncrements('id').primary().index();
            table.string('nome', 150).checkLength('<=', 150).index().notNullable();
            table.string('email').index().checkLength('>=', 6).unique().notNullable();
            table.string('senha').checkLength('>=', 6).notNullable();

            table.comment('Tabela utilizada para armazenar usuários do sistema.');
        }).then(() => {
            console.log(`# Created Table ${ETableNames.usuario}`);
        });
}


export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(ETableNames.usuario)
        .then(() => {
            console.log(`# Dropped Table ${ETableNames.usuario}`);
        });
}