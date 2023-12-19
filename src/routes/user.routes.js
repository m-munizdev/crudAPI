import { create, get, getId, update, remove} from "../controllers/user.controller"; // importa a função create do arquivo src/controllers/user.controller.js

const userRoutes = (app) => {
  app.post("/user", create); // cria um novo usuario no banco de dados
  // ele esta fazendo uma requisição post para a rota /user e chamando a função create do arquivo src/controllers/user.controller.js que vai criar um novo usuario no banco de dados através da função createUser do arquivo src/repositorys/user.repository.js que faz a comunicação com o banco de dados através da instancia do PrismaClient criada no arquivo src/services/prisma.js //! CREATE
  app.get("/user", get); // retorna todos os usuarios do banco de dados //! READ
  app.get("/user/:id", getId); // retorna um usuario do banco de dados pelo id //! READ BY ID
  app.put("/user/:id", update); // atualiza um usuario do banco de dados pelo id //! UPDATE
  app.delete("/user/:id", remove); // exclui um usuario do banco de dados pelo id //! DELETE
};

export default userRoutes; // exporta a função userRoutes para ser usada em outros arquivos
