import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPessoa } from "../../models";

export const updateById = async (id: number, pessoa: Omit<IPessoa, 'id'>): Promise<void | Error> => {

    try {

        const consulta = await Knex(ETableNames.cidade).select('*').where('id', '=', pessoa.cidadeId).first();

        if (!consulta ) return new Error('A cidade usada na atualização não foi encontrada!');

        const select = await Knex(ETableNames.pessoa).select('*').where('id', '=', id).first();
        if (!select) return new Error('Registro não encontrado!');

        const result = await Knex(ETableNames.pessoa).update(pessoa).where('id', '=', id);
        if (result > 0) return;

        return new Error('Erro ao atualizar o registro');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};