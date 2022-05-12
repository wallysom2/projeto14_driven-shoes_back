import express, { json } from 'express';
import joi from 'joi';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

import db from './db.js';


const app = express();
dotenv.config();
app.use(json());
app.use(cors());

//login
app.post('/signin', async (req, res) => {
    const signUpSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const { error } = signUpSchema.valid(req.body, { abortEarly: false });
    if (error) {
        console.log(error.details);
    }
    try {
        const user = await db.collection('users').findOne({ email: req.body.email });
        if (!user) {
            res.status(401).send('Invalid email or password');
        }
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = uuid();
            await db.collection('sessions').insertOne({ token, userId: user._id });
           return res.send({ token, name: user.name });
        }
        return res.status(440).send('Invalid email or password');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro ao tentar logar o usuário');
    }
})

//cadastro
app.post('/signup', async (req, res) => {

    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref('password')
    });
    const { error } = signUpSchema.valid(req.body, { abortEarly: false });
    if (error) {
        console.log(error.details);
    }
    try {
        const { name, email, password } = req.body;
        const SALT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT);

        await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword
        });
        res.send('Usuário cadastrado com sucesso!');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro ao cadastrar usuário');
    }

});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

});
