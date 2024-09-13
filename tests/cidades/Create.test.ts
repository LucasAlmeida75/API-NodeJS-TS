import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Cidades - Create', () => {

    let accessToken = "";

    beforeAll(async () => {
        const email = "usuario@gmail.com";
        const senha = "123456";
        await testServer.post('/cadastrar').send({ nome: "Teste", email, senha });

        const signInRes = await testServer.post('/login').send({ email, senha });

        accessToken = signInRes.body.accessToken;
    });

    it('Criar registro', async () => {
        const resp = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({ nome: "Porto Alegre" });

        expect(resp.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof resp.body).toEqual('number');
    });

    it('Tentar criar um registro sem token de acesso', async () => {
        const resp = await testServer
            .post('/cidades')
            .send({ nome: "Po" });

        expect(resp.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resp.body).toHaveProperty('errors.default');
    });

    it('Nome com menos de 3 caracteres', async () => {
        const resp = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({ nome: "Po" });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
    });
});