const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app/src/server');

describe('API - cas limites et routes', function () {
    it('GET /api/products/:id avec id invalide doit renvoyer 404', async function () {
        const res = await request(app).get('/api/products/not-a-number');

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Produit introuvable');
    });

    it('GET /api/unknown doit retourner 404 quand la route API n’existe pas', async function () {
        const res = await request(app).get('/api/unknown');

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal(undefined);
    });

    it('POST /api/register avec mot de passe vide doit renvoyer 400', async function () {
        const res = await request(app)
            .post('/api/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                password: ''
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Tous les champs sont obligatoires');
    });
});
