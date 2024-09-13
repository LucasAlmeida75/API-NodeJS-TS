import * as create from './Create';
import * as getAll from './GetAll';
import * as count from './Count';
import * as getById from './GetById';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';

export const PessoasProvider = {
    ...create,
    ...getAll,
    ...count,
    ...getById,
    ...updateById,
    ...deleteById,
};