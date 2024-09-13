import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const deleteById = async (id: number): Promise<void | Error> => {

    try {
        const select = await Knex(ETableNames.cidade).select('*').where('id', '=', id).first();

        if (!select) return new Error('Registro não encontrado!');

        const result = await Knex(ETableNames.cidade).where('id', '=', id).del();

        if (result > 0) return;

        return new Error('Erro ao apagar o registro');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};