import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Cidades - UpdateById', () => {
    let accessToken = "";

    beforeAll(async () => {
        const email = "usuario@gmail.com";
        const senha = "123456";
        await testServer.post('/cadastrar').send({ nome: "Teste", email, senha });

        const signInRes = await testServer.post('/login').send({ email, senha });

        accessToken = signInRes.body.accessToken;
    });

    it('Atualizar registro por id', async () => {
        const resp1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({ nome: "Caxias do Sul" });

        expect(resp1.statusCode).toEqual(StatusCodes.CREATED);

        const resp2 = await testServer
            .put(`/cidades/${resp1.body}`)
            .set({Authorization: `Bearer ${accessToken}`})
            .send({nome: 'Caxias'});

        expect(resp2.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tentar atualizar registro que não existe', async () => {
        const resp = await testServer
            .put('/cidades/99999')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({nome: 'Caxias'});

        expect(resp.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(resp.body).toHaveProperty('errors.default');
    });
});