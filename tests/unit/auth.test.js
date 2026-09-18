const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app/src/server');

describe('API Authentification', function () {

    it('doit retourner 400 si un champ est manquant à l’inscription', async function () {

        const res = await request(app)
            .post('/api/register')
            .send({
                firstName: 'John'
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Tous les champs sont obligatoires');
    });

    it('doit retourner 400 si le mot de passe est trop court', async function () {

        const res = await request(app)
            .post('/api/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.fr',
                password: '123'
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Le mot de passe doit contenir au moins 8 caractères');
    });

});