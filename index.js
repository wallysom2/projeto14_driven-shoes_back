import express, {json} from 'express';
import joi from 'joi';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import db from './db.js';


const app = express();
dotenv.config();
app.use(json());

//cadastro
app.post('/signup', async (req, res) => {
const {name, email, password, confirmPassword} = req.body;

    //validação -> joi
    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref('password')
    });
    const {error} = signUpSchema.valid(req.body, {abortEarly: false});
    if(error) {
        return res.status(422).send(error.details.map (detail => detail.message));
    }
 try {
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


