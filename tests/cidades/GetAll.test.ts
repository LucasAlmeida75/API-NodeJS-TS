import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Cidades - GetAll', () => {
    let accessToken = "";

    beforeAll(async () => {
        const email = "usuario@gmail.com";
        const senha = "123456";
        await testServer.post('/cadastrar').send({ nome: "Teste", email, senha });

        const signInRes = await testServer.post('/login').send({ email, senha });

        accessToken = signInRes.body.accessToken;
    });

    it('Buscar todas as cidades', async () => {
        const resp1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({ nome: "Caxias do Sul" });

        expect(resp1.statusCode).toEqual(StatusCodes.CREATED);

        const resp2 = await testServer
            .get('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send();

        expect(Number(resp2.header['x-total-count'])).toBeGreaterThan(0);
        expect(resp2.statusCode).toEqual(StatusCodes.OK);
        expect(resp2.body.length).toBeGreaterThan(0);
    });
});