const request = require('supertest');
const app = require('../src/app');
describe('Auth Test', ()=>{
    if("should login user", async()=>{
        const res = (await request(app).post("/api/auth/login")).setEncoding({username: "admin", password: "123456"});
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
    });
});