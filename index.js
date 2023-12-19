import express from 'express'; // uma forma diferente de importar o express
import cors from 'cors'; // uma forma diferente de importar o cors
import dotenv from 'dotenv'; // uma forma diferente de importar o dotenv
import routes from './src/routes'; // importa a função routes do arquivo src/routes/index.js

dotenv.config(); // configura o dotenv

const app = express(); // cria uma instância do express

app.use(cors()); // usa o cors que é uma forma de permitir que o front-end acesse o back-end (libera qualquer acesso) (geralmente é usado pra segurança, mas é possível proteger a API de outras formas)
app.use(express.json()); // usa o express.json que é uma forma de permitir que o express entenda o formato json (sempre é declarado antes das rotas)
console.log('esteve aqui');

routes(app); // chama a função routes do arquivo src/routes/index.js

app.listen(3001);// inicia o servidor na porta 3001
console.log('servidor iniciou');