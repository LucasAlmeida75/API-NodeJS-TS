import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services";

export const ensureAuthenticated: RequestHandler = async (req, res, next) => {
    const unauthorized = {
        errors: {
            default: 'Não autenticado'
        }
    };

    const secretNotFound = {
        errors: {
            default: 'Erro ao verificar o token'
        }
    };

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json(unauthorized);
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
        return res.status(StatusCodes.UNAUTHORIZED).json(unauthorized);
    }

    const jwtData = JWTService.verify(token);

    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(secretNotFound);
    } else if (jwtData === 'INVALID_TOKEN') {
        return res.status(StatusCodes.UNAUTHORIZED).json(unauthorized);
    }

    req.headers.idUsuario = jwtData.uid.toString();

    return next();
}