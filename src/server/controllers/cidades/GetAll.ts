import { Request, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { CidadesProvider } from "../../database/providers/cidades";

interface IQueryProps {
    id?: number;
    page?: number;
    limit?: number;
    filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        id: yup.number().integer().default(0),
        page: yup.number().moreThan(0),
        limit: yup.number().moreThan(0),
        filter: yup.string()
    }))
}));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await CidadesProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '', Number(req.query.id || 0));
    const count = await CidadesProvider.count(req.query.filter || '');

    if (result instanceof Error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: result.message
            }
        });
    } else if (count instanceof Error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: count.message
            }
        });
    }

    res.setHeader('acecss-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};