const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app/src/server');

describe('API Health', function () {

    it('doit retourner un statut ok', async function () {

        const res = await request(app)
            .get('/api/health');

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('ok');
    });

});