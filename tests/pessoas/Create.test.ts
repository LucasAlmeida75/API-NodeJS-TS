import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Pessoas - Create', () => {
    let cidadeId: number | undefined = undefined;
    let accessToken = "";

    beforeAll(async () => {
        const email = "usuario@gmail.com";
        const senha = "123456";
        await testServer.post('/cadastrar').send({ nome: "Teste", email, senha });

        const signInRes = await testServer.post('/login').send({ email, senha });

        accessToken = signInRes.body.accessToken;

        const resCidade = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({ nome: "Teste" });

        cidadeId = resCidade.body;
    });

    it('Criar registro', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jorge",
                email: "emailtestecreate@gmail.com",
                cidadeId
            });

        expect(resp.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof resp.body).toEqual('number');
    });

    it('Criar registro com e-mail duplicado', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jorge",
                email: "emailtesteduplicado@gmail.com",
                cidadeId
            });

        expect(resp.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof resp.body).toEqual('number');

        const resp2 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jorge",
                email: "emailtesteduplicado@gmail.com",
                cidadeId
            });

        expect(resp2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(resp2.body).toHaveProperty('errors.default');
    });

    it('Nome com menos de 3 caracteres', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jo",
                email: "emailtestecreate@gmail.com",
                cidadeId
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
    });

    it('Criar registro sem nome', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                email: "emailtestecreate@gmail.com",
                cidadeId
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
    });

    it('Criar registro sem email', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jorge",
                cidadeId
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.email');
    });

    it('Criar registro com email inválido', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jorge",
                cidadeId,
                email: "aaa"
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.email');
    });

    it('Criar registro sem cidadeId', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "jorge",
                email: "emailtestecreate@gmail.com"
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.cidadeId');
    });

    it('Criar registro com cidadeId inválido', async () => {
        const resp = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({});

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
        expect(resp.body).toHaveProperty('errors.body.cidadeId');
        expect(resp.body).toHaveProperty('errors.body.email');
    });
});