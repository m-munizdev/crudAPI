import bcrypt from "bcrypt"; // importa o bcrypt para criptografar a senha do usuario
import { userValidation } from "../validation/user.validation"; // importa a função userValidation do arquivo src/validation/user.validation.js
import { createUser, getAll, getById , updateUser, deleteUser} from "../repositorys/user.repository"; // importa a função createUser do arquivo src/repositorys/user.repository.js //! CREATE , READ

//! CREATE
export const create = async (req, res) => {
  try {
    await userValidation.validate(req.body); // valida os dados do usuario antes de executar o resto do código
    const hashPassword = await bcrypt.hash(req.body.password, 10); // criptografa a senha do usuario
    req.body.password = hashPassword; // substitui a senha do usuario pela senha criptografada
    const user = await createUser(req.body); // cria um novo usuario no banco de dados
    // aqui está chamando a função createUser do repository e user está recebendo o retorno dessa função
    res.status(200).send(user); // retorna o usuario criado, lembrando que em user está o retorno da função createUser
  } catch (e) {
    res.status(400).send(e); // retorna um erro caso não consiga criar o usuario
  }
};

//! READ
export const get = async (req, res) => {
  try {
    const users = await getAll(); // retorna todos os usuarios do banco de dados
    res.status(200).send(users); // retorna os usuarios
  } catch (e) {
    res.status(400).send(e); // retorna um erro caso não consiga retornar os usuarios
  }
};

//! READ BY ID
//getId retorna um usuario do banco de dados pelo id
export const getId = async (req, res) => {
  try {
    const user = await getById(Number(req.params.id)); // retorna o usuario do banco de dados pelo id
    // Number é para converter o id para number, pois o id é um number e o req.params.id é uma string
    // o que entra em getById como argumento é o id a ser pesquisado no banco de dados
    res.status(200).send(user); // retorna o usuario
  } catch (e) {
    res.status(400).send(e); // retorna um erro caso não consiga retornar o usuario
  }
};


//! UPDATE
//update retorna um usuario do banco de dados pelo id
export const update = async (req, res) => {
  try {
    const user = await updateUser(Number(req.params.id), req.body); // retorna o usuario do banco de dados pelo id
    // updateUser é a função que atualiza o usuario no banco de dados
    // Number é para converter o id para number, pois o id é um number e o req.params.id é uma string
    // o que entra em updateUser como argumento é o id a ser pesquisado no banco de dados e o body da requisição que ira atualizar o usuario
    res.status(200).send(user); // retorna o usuario
  } catch (e) {
    res.status(400).send(e); // retorna um erro caso não consiga retornar o usuario
  }
}

//! DELETE
//delete exclui um usuario do banco de dados pelo id
export const remove = async (req, res) => {
  try {
    await deleteUser(Number(req.params.id)); // exclui o usuario do banco de dados pelo id
    // deleteUser é a função que exclui o usuario no banco de dados
    // Number é para converter o id para number, pois o id é um number e o req.params.id é uma string
    // o que entra em deleteUser como argumento é o id a ser pesquisado no banco de dados
    res.status(200).send(); // retorna apenas o status 200
  } catch (e) {
    res.status(400).send(e); // retorna um erro caso não consiga excluir o usuario
  }
}
