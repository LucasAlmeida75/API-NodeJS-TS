import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe('Usuários - SignIn', () => {
    beforeAll(async () => {
        await testServer
            .post('/cadastrar')
            .send({
                nome: "Jorge",
                email: "emailtestesignin@gmail.com",
                senha: "123456"
            });
    });

    it('Buscar registro por email', async () => {
        const resp2 = await testServer
            .post(`/login`)
            .send({
                email: "emailtestesignin@gmail.com",
                senha: "123456"
            });

        expect(resp2.statusCode).toEqual(StatusCodes.OK);
        expect(resp2.body).toHaveProperty("accessToken");
    });

    it('Tentar buscar registro que não existe', async () => {
        const resp = await testServer
            .post('/login')
            .send({
                email: "email@gmail.com",
                senha: "1234561323"
            });

        expect(resp.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resp.body).toHaveProperty('errors.default');
    });
});