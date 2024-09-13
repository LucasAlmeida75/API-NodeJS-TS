import { Request, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { IUsuario } from "../../database/models";
import { UsuariosProvider } from "../../database/providers/usuarios";
import { PasswordCrypto } from "../../shared/services/PasswordCrypto";
import { JWTService } from "../../shared/services";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IBodyProps extends Omit<IUsuario, 'id' | 'nome'> {  }

export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().email().min(6),
        senha: yup.string().required().min(6)
    }))
}));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const dadosInvalidos = {
        errors: {
            default: 'E-mail ou senha são inválidos'
        }
    };

    const { email, senha } = req.body;
    const usuario = await UsuariosProvider.getByEmail(email);

    if (usuario instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json(dadosInvalidos);
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(senha, usuario.senha);

    if (!passwordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json(dadosInvalidos);
    } else {
        const accessToken = JWTService.sign({uid: usuario.id});

        if (accessToken === "JWT_SECRET_NOT_FOUND") {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'Erro ao gerar o token de acesso'
                }
            });
        }

        return res.status(StatusCodes.OK).json({ accessToken })
    }
};