const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app/src/server');

describe('API Produits', function () {

    it('doit retourner la liste des produits', async function () {

        const res = await request(app)
            .get('/api/products');

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(6);
    });

    it('doit retourner le produit ayant l’id 1', async function () {

        const res = await request(app)
            .get('/api/products/1');

        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(1);
        expect(res.body.name).to.equal('Laptop Pro 14"');
    });

    it('doit retourner 404 pour un produit inexistant', async function () {

        const res = await request(app)
            .get('/api/products/999');

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Produit introuvable');
    });

});