# Passo a passo

## Passo 1: baixar o que será utilizado

- node
- yarn
- npm

## Passo 2: Inicializando o banco de dados

- `npm i -g yarn` => baixa o yarn
- `yarn init -y` => inicia o yarn
- é criado um modelo em um arquivo [docker-compose.yml](/docker-compose.yml)
- `docker compose up` => digitado no terminal para iniciar a imagem
  > dessa forma , a imagem fica rodando no terminal, então temos uma forma alternativa
- `docker compose up -d` => digitado no terminal para iniciar a imagem sem mostrar no terminal a execução
  > depois de executar isso é pra aparecer apenas que o 'Container db-postgres-evento Started'
- `docker ps` => usado para mostrar os containers (imagens) iniciados
- no final , ele cria uma pasta pra os arquivos do bd

## Passo 3: Instalando e usando o prisma

- `yarn add prisma @prisma/client` => baixando e instalando o prisma e o prisma/client (este ultimo pra usar com js)
- `yarn prisma init` => usado pra iniciar prisma (cria uma pasta do prisma e um arquivo .env)
- `DATABASE_URL="postgresql://<usuario definido em docker-compose.yml>:<senha definida em docker-compose.yml>@localhost:<porta do computador definido em docker-compose.yml>/<nome do banco de dados>?schema=public"` => valores definidos no arquivo .env
- no final, o arquivo.env deste aqui ficou assim: `DATABASE_URL="postgresql://pguser:pgpassword@localhost:5435/mydb?schema=public"`

### criando tabela no bd

- criar um model em [schema.prisma](/prisma/schema.prisma) da seguinte forma

  ```
  model User {
  id Int @id @default(autoincrement())
  //@id indica que se trata de uma chave primária
  // @default(autoincrement()) indica que o valor será incrementado automaticamente
  name String
  email String @unique
  // @unique indica que o valor deve ser único
  password String
  phone String?
  // '?' indica que o valor é opcional
  createdAt DateTime @default(now()) //retorna a data e hora atual que o registro foi criado
  // DateTime é um tipo de dado do prisma que representa data e hora
  // @default(now()) indica que o valor será preenchido automaticamente
  // now() é uma função do postgresql que retorna a data e hora atual
  updatedAt DateTime @updatedAt //retorna a data e hora atual que o registro foi atualizado
  // @updatedAt diz que o valor será preenchido automaticamente
  }
  ```

- precisa executar o modelo `yarn prisma migrate dev --name init` => ele traduz o modelo criado anteriormente pra linguagem sql e cria um arquivo [migration.sql](/prisma/migrations/20231218192804_init/migration.sql) dentro de uma pasta [migration](/prisma/migrations/)

## Passo 4: iniciando o servidor da API

- cria uma pasta [src](/src/) e cria um arquivo na raiz chamado [index.js](/index.js)
- baixar o express, o cors e dotenv (ler o arquivo env) usando o comando `yarn add express cors dotenv`
- criar os primeiros códigos em [index.js](/index.js) => verifique os comentários no arquivo para entender onde usa express, cors e dotenv
  > Note que o express, cors e dotenv foram importados com import no arquivo [index.js](/index.js), portanto, ao executar o servidor com `node index.js`, o servidor não vai entender essa sintaxe. Por isso é necessário criar o seguinte código em [package.json](/package.json):

```
"scripts": {
    "start": "nodemon index.js"
  },
```

> Note que está usando o nodemon , por isso é preciso instalar o mesmo com o comando `yarn add -D nodemon` , onde o -D está ai pois está instalando apenas em ambiente de desenvolvimento **(boas práticas)**
> infelizmente, mesmo assim, o nodemon não vai entender o import , por isso instalamos o sucrase em ambiente de desenvolvimento com o comando `yarn add -D sucrase` , posteriormente criamos o arquivo [nodemon.json](/nodemon.json) na pasta raiz e adicionamos o seguinte código

```
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```

> sucrase serve para usar import/export pois o node não suporta nativamente
> depois disso tudo, basta mandar o comando `yarn start` para iniciar o servidor

## Passo 5: Desenvolvendo a API

- cria um pasta [services](/src/services/) no [src](/src/) e dentro dessa pasta, criar o arquivo [prisma.js](/src/services/prisma.js)
- veja os comentários no arquivo [prisma.js](/src/services/prisma.js)
> nela é importado o prismaClient para o arquivo se comunicar com o banco de dados e nela é exportado uma instancia do Prisma cliente, assim eu não preciso importar toda vez

```
import { PrismaClient } from "@prisma/client"; // importa o PrismaClient para o arquivo se comunicar com o banco de dados.
export const prisma = new PrismaClient(); // cria uma instancia do PrismaClient e exporta ela para os outros arquivos.
// Ao inves de toda vez que for comunicar com o banco de dados, importar o PrismaClient, podemos criar uma instancia dele e exportar essa instancia para os outros arquivos.
```

---

- Agora criamos uma pasta [repositorys](/src/repositorys/) dentro de [src](/src/) e nela colocamos o arquivo [user.repository.js](/src/repositorys/user.repository.js)
- Nessa nova pasta vamos criar as funções para fazer operações no banco de dados e é nela que é feita a conexão com o banco de dados usando , por exemplo, `prisma.user.create`
> Agora nós importamos o prismaClient do services e aplicamos na função , indicando através dele o que será manipulado no banco de dados

```
import {prisma} from "../services/prisma"; // importa a instancia do PrismaClient criada no arquivo src/services/prisma.js

export const createUser = async (data) => {
    const user = await prisma.user.create({
      data // recebe todos os dados do usuario definidos como modelo
    }); // cria um novo usuario no banco de dados
    return user; // retorna o usuario criado
};
```

---

- Agora criamos uma pasta [controllers](/src/controllers/) dentro de [src](/src/) e nela colocamos o arquivo [user.controller.js](/src/controllers/user.controller.js)
- Nessa nova pasta, vamos exportar as funções criadas no [user.repository.js](/src/repositorys/user.repository.js)
- A função do controller é criar as funções de receber requisição, tratar-las (com tratamento de erros, por exemplo) e chamar o repositório, que faz o que tem que fazer e retorna para o controller
> Aqui exportamos a função que desenvolvemos em repositorys e recebemos as requisições , fazemos o tratamento de erro, aplicamos essa requisição na função que foi exportada e entregamos a devida resposta

```
import { createUser } from "../repositorys/user.repository"; // importa a função createUser do arquivo src/repositorys/user.repository.js

export const create = async (req, res) => {
  try {
    const user = await createUser(req.body); // cria um novo usuario no banco de dados
    // aqui está chamando a função createUser do repository e user está recebendo o retorno dessa função
    res.status(200).send(user); // retorna o usuario criado, lembrando que em user está o retorno da função createUser
  }catch (e) {
    res.status(400).send(e); // retorna um erro caso não consiga criar o usuario
  }
};
```

---

- Agora criamos uma pasta [routers](/src/routes/) dentro de [src](/src/) e nela colocamos os arquivos [index.js](/src/routes/index.js) e [user.routes.js](/src/routes/user.routes.js)
- dentro do [index.js](/src/routes/index.js) colocamos todas as rotas,  pois é esse arquivo que será importado em [index.js](/index.js) da pasta raiz
- [user.routes.js](/src/routes/user.routes.js) é usado para receber a função controller e aplicar em uma requisição especifica em um determinada rota
> Em [user.routes.js](/src/routes/user.routes.js) se faz uma requisição post para a rota `/user` onde é chamando a função create criada em [user.controller.js](/src/controllers/user.controller.js) que vai criar um novo usuario no banco de dados através da função createUser do [user.repository.js](/src/repositorys/user.repository.js) que faz a comunicação com o banco de dados através da instancia do PrismaClient criada em [prisma.js](/src/services/prisma.js)<br><br>
>Em [index.js](/src/routes/index.js) se faz uma função que entra o app (que é uma instancia do express) como argumento que chama a função userRoutes de [user.routes.js](/src/routes/user.routes.js) que por sua vez faz uma requisição post para a rota `/user` onde é chamando a função create criada em [user.controller.js](/src/controllers/user.controller.js) que vai criar um novo usuario no banco de dados através da função createUser do [user.repository.js](/src/repositorys/user.repository.js) que faz a comunicação com o banco de dados através da instancia do PrismaClient criada em [prisma.js](/src/services/prisma.js)<br><br>

---
- Por ultimo , em [index.js](/index.js) importamos o routes que foi exportado de [index.js](/src/routes/index.js) de routes e aplicamos a função no app instanciado de express
---
---
---
### Resumo Completo
> * Primeiramente, em [index.js](/index.js) é feito uma instancia do express chamada `app` , nesse `app` é configurado para que o mesmo permita que o front acesse o back através do `cors()` e que seja capaz de ler arquivos json. <br><br>
> * Posteriormente uma função chamada `routes`, exportada de [index.js](/src/routes/index.js) das rotas, é chamada passando como argumento o `app` criado na etapa anterior.<br><br>  
> * Essa função `routes` pega o argumento `app` recebido e aplica na função `userRoutes` como argumento da mesma, função essa exportada de [user.routes.js](/src/routes/user.routes.js)<br><br>
> * A função `userRoutes` recebe como argumento `app` e usa esse argumento pra aplica o método(requisição) `post` que recebe como argumento a rota estabelecida para aquela requisição e a constante `create` , constante essa exportada de [user.controller.js](/src/controllers/user.controller.js)<br><br>
> * A constante `create` recebe a função async que recebe como argumento a requisição passada pelo método `post` anterior e aplica o body dessa requisição como argumento da função `createUser`, essa costante recebe uma resposta (status) que irá retornar para o método `post` anterior.  A função `createUser`, por sua vez, é exportada de [user.repository.js](/src/repositorys/user.repository.js) <br><br>
> * A função `createUser` recebe como argumento o body dessa requisição e cadastra ele no banco de dados através do objeto `prisma` que tem o modelo `user` criado em [schema.prisma](/prisma/schema.prisma) e o método `create`, que é nativo do prisma, pra adicionar elementos do body no banco de dados baseados nesse modelo.  O `prisma` é exportado do [prisma.js](/src/services/prisma.js) <br><br>
> * O `prisma` é uma instancia de `prismaClient` que faz o arquivo se comunicar com o banco de dados


# Conhecimentos Extras

## Criptografando senhas

* `yarn add bcrypt` => biblioteca usada para criptografar senhas
* Em [user.controller.js](/src/controllers/user.controller.js):
  - `import bcrypt from "bcrypt";` => importamos a biblioteca
  - `const hashPassword = await bcrypt.hash(req.body.password, 10);` => dentro de `create` adicionamos essa linha de código pra criptografar a senha
  - `req.body.password = hashPassword;` => ainda dentro de `create` , antes de chamar a função `createUser`, transformamos o valor dentro de `req.body.password` na senha criptografada guardada em `hashPassword`

## Como retornar tudo, menos a senha 

* Em [user.repository.js](/src/repositorys/user.repository.js):
  - Depois de `data` e dentro de `CreateUser` adicionamos:
    ```
    select: {
      // retorna apenas os dados definidos abaixo
      id: true, // retorna o id do usuario
      name: true, // retorna o nome do usuario
      email: true, // retorna o email do usuario
      password: false, // não retorna a senha do usuario
      phone: true, // retorna o telefone do usuario
      createdAt: true, // retorna a data de criação do usuario
      updatedAt: true, // retorna a data de atualização do usuario
    }
    ```
    - o `select` é usado para determinar o que mostrar 

## Tratando erros de inconsistencia (id repetidas ou falta de preenchimento de algo)

* O objetivo é mostrar os erros dos eventos possíveis 
* `yarn add yup` => usado pra fazer as validações do que é obrigatório e do que não é,  do que está sendo enviado 
* criar a pasta chamada [validation](/src/validation/) com um arquivo [user.validation.js](/src/validation/user.validation.js) e usar o `yup` pra criar as validações assim: 
  ```
  import * as yup from 'yup'; //importando o yup
  //yup é uma biblioteca de validação de dados
  //object é um objeto que vem a ser o body da requisição
  export const userValidation = yup.object({
    name: yup.string().required(), //validando o nome
    //string valida se é uma string
    //required valida se foi preenchido, pois o nome é obrigatório
    email: yup.string().email().required(), //validando o email
    //email valida se está no formato de email
    password: yup.string().required().min(6), //validando a senha
    //min valida se tem no mínimo 6 caracteres
    phone: yup.string().nullable(true).min(11).max(11), //validando o telefone
    //nullable(true) valida se é nulo, como tem true, ele aceita nulo
    //max e min garantem que o telefone tenha 11 caracteres
  })
  ```
* Agora importa a função `userValidation` de [user.validation.js](/src/validation/user.validation.js) em [user.controller.js](/src/controllers/user.controller.js) => `import { userValidation } from "../validation/user.validation";`
* Adiciona depois do `try` e antes da criptografia da senha ou da execução da função , é colocado `await userValidation.validate(req.body);` para realizar a validação antes de tudo

## criar um get
* veja em todos como ficou 