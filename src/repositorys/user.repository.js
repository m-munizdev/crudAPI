import { prisma } from "../services/prisma"; // importa a instancia do PrismaClient criada no arquivo src/services/prisma.js

//! CREATE
export const createUser = async (data) => {
  const user = await prisma.user.create({
    data, // recebe todos os dados do usuario definidos como modelo
    select: {
      // retorna apenas os dados definidos abaixo
      id: true, // retorna o id do usuario
      name: true, // retorna o nome do usuario
      email: true, // retorna o email do usuario
      password: false, // não retorna a senha do usuario
      phone: true, // retorna o telefone do usuario
      createdAt: true, // retorna a data de criação do usuario
      updatedAt: true, // retorna a data de atualização do usuario
    },
  }); // cria um novo usuario no banco de dados
  return user; // retorna o usuario criado
};

//! READ
// getAll retorna todos os usuarios do banco de dados
// findMany é uma função do PrismaClient que busca todos os usuarios do banco de dados
// lembrando que user é o modelo definido em schema.prisma
export const getAll = async () => {
  const users = await prisma.user.findMany({
    // se não usasse o select, ele retornaria todos os dados do usuario
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  }); // retorna todos os usuarios do banco de dados
  return users; // retorna os usuarios
};

//! READ BY ID
// getById retorna um usuario do banco de dados pelo id
export const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id, // busca o usuario pelo id, poderia ser apenas id, pois o nome da variavel é igual ao nome do campo e poderiamos colocar outros campos como email, phone, etc.
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  }); // retorna o usuario do banco de dados pelo id
  return user; // retorna o usuario
};

//! UPDATE
// update retorna o usuario atualizado
export const updateUser = async (id, data) => {
  const user = await prisma.user.update({
    where: {
      id: id, // busca o usuario pelo id, poderia ser apenas id, pois o nome da variavel é igual ao nome do campo e poderiamos colocar outros campos como email, phone, etc.
    },
    data, // recebe todos os dados do usuario definidos como modelo
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  }); // atualiza o usuario do banco de dados pelo id
  return user; // retorna o usuario atualizado
};


//! DELETE
// deleteUser retorna o usuario deletado
export const deleteUser = async (id) => {
  await prisma.user.delete({
    // nesse caso, não precisa retornar nada, pois o usuario foi deletado
    where: {
      id: id, // busca o usuario pelo id, poderia ser apenas id, pois o nome da variavel é igual ao nome do campo e poderiamos colocar outros campos como email, phone, etc.
    },
  }); // deleta o usuario do banco de dados pelo id
  return; // não retorna nada, pois o usuario foi deletado
}
