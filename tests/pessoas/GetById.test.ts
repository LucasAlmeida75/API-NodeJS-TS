import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Pessoas - GetById', () => {
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

    it('Buscar registro por id', async () => {
        const resp1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({
                nome: "Jorge",
                email: "emailtestegetbyid@gmail.com",
                cidadeId
            });

        expect(resp1.statusCode).toEqual(StatusCodes.CREATED);

        const resp2 = await testServer
            .get(`/pessoas/${resp1.body}`)
            .set({Authorization: `Bearer ${accessToken}`})
            .send();

        expect(resp2.statusCode).toEqual(StatusCodes.OK);
        expect(resp2.body).toHaveProperty('nome');
    });

    it('Tentar buscar registro que não existe', async () => {
        const resp = await testServer
            .get('/pessoas/99999')
            .set({Authorization: `Bearer ${accessToken}`})
            .send();

        expect(resp.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(resp.body).toHaveProperty('errors.default');
    });
});