const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app/src/server');

describe('API Authentification avancée', function () {
    it('doit créer un compte avec un email unique', async function () {
        const res = await request(app)
            .post('/api/register')
            .send({
                firstName: 'Alice',
                lastName: 'Martin',
                email: 'alice@shopnow.test',
                password: 'Password123!'
            });

        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Compte créé avec succès');
        expect(res.body.user.email).to.equal('alice@shopnow.test');
    });

    it('doit refuser un email déjà enregistré', async function () {
        const res = await request(app)
            .post('/api/register')
            .send({
                firstName: 'Demo',
                lastName: 'Student',
                email: 'student@shopnow.test',
                password: 'Password123!'
            });

        expect(res.status).to.equal(409);
        expect(res.body.error).to.equal('Un compte existe déjà avec cet email');
    });

    it('doit connecter un utilisateur valide', async function () {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'student@shopnow.test',
                password: 'Password123!'
            });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Connexion réussie');
        expect(res.body.user.email).to.equal('student@shopnow.test');
    });

    it('doit refuser un login avec des identifiants mauvais', async function () {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'student@shopnow.test',
                password: 'wrong-password'
            });

        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Email ou mot de passe incorrect');
    });
});
