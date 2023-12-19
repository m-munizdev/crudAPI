import * as yup from "yup"; //importando o yup

//yup é uma biblioteca de validação de dados
//object é um objeto que vem a ser o body da requisição
export const userValidation = yup.object({
  name: yup.string().required("nome é obrigatório"), //validando o nome
  //string valida se é uma string
  //required valida se foi preenchido, pois o nome é obrigatório
  email: yup.string().email("use email no formato 'example@email.com'").required("email é obrigatório"), //validando o email
  //email valida se está no formato de email
  password: yup.string().required().min(6), //validando a senha
  //min valida se tem no mínimo 6 caracteres
  phone: yup.string().nullable(true).max(11,'número errado de caracteres').min(11, 'número errado de caracteres'), //validando o telefone
  //nullable(true) valida se é nulo, como tem true, ele aceita nulo
  //max e min garantem que o telefone tenha 11 caracteres
});
