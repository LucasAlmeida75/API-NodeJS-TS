import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Usuários - SignUp', () => {

    it('Criar registro', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                nome: "Jorge",
                email: "emailtestecreate@gmail.com",
                senha: '123456'
            });

        expect(resp.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof resp.body).toEqual('number');
    });

    it('Criar registro com e-mail duplicado', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                nome: "Jorge",
                email: "emailtesteduplicado@gmail.com",
                senha: '123456'
            });

        expect(resp.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof resp.body).toEqual('number');

        const resp2 = await testServer
            .post('/cadastrar')
            .send({
                nome: "Jorge",
                email: "emailtesteduplicado@gmail.com",
                senha: '123456'
            });

        expect(resp2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(resp2.body).toHaveProperty('errors.default');
    });

    it('Nome com menos de 3 caracteres', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                nome: "Jo",
                email: "emailtestecreate@gmail.com",
                senha: '123456'
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
    });

    it('Criar registro sem nome', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                email: "emailtestecreate@gmail.com",
                senha: '123456'
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
    });

    it('Criar registro sem email', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                nome: "Jorge",
                senha: '123456'
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.email');
    });

    it('Criar registro com email inválido', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                nome: "Jorge",
                senha: '123456',
                email: "aaa"
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.email');
    });

    it('Criar registro sem senha', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({
                nome: "jorge",
                email: "emailtestecreate@gmail.com"
            });

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.senha');
    });

    it('Criar registro com senha inválida', async () => {
        const resp = await testServer
            .post('/cadastrar')
            .send({});

        expect(resp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resp.body).toHaveProperty('errors.body.nome');
        expect(resp.body).toHaveProperty('errors.body.senha');
        expect(resp.body).toHaveProperty('errors.body.email');
    });
});