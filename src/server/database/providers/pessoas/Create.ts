import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPessoa } from "../../models";

export const create = async (pessoa: Omit<IPessoa, 'id'>): Promise<number | Error> => {

    try {
        const consulta = await Knex(ETableNames.cidade).select('*').where('id', '=', pessoa.cidadeId).first();
        if (!consulta ) return new Error('Cidade não encontrada!');

        const [result] = await Knex(ETableNames.pessoa).insert(pessoa).returning('id');

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }
};