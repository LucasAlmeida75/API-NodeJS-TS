import { Request, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { PessoasProvider } from "../../database/providers/pessoas";

interface IQueryProps {
    page?: number;
    limit?: number;
    filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        page: yup.number().integer().moreThan(0).default(1),
        limit: yup.number().integer().moreThan(0).default(7),
        filter: yup.string().default('')
    }))
}));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await PessoasProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '');
    const count = await PessoasProvider.count(req.query.filter || '');

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