import { Request, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { IUsuario } from "../../database/models";
import { UsuariosProvider } from "../../database/providers/usuarios";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IBodyProps extends Omit<IUsuario, 'id'> {  }

export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nome: yup.string().required().min(3).max(150),
        email: yup.string().required().email().min(6),
        senha: yup.string().required().min(6)
    }))
}));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await UsuariosProvider.create(req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result);
};