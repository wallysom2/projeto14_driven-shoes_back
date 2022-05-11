import express, {json} from 'express';
import joi from 'joi';

const app = express();
app.use(json());

//cadastro
app.post('/signup', (req, res) => {
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
    
    
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

