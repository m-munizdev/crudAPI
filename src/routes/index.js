import userRoutes from "./user.routes"; // importa a função userRoutes do arquivo src/routes/user.routes.js

const routes = (app) => {
  userRoutes(app); // chama a função userRoutes do arquivo src/routes/user.routes.js
}

export default routes; // exporta a função routes para ser usada em outros arquivos , default é usado para exportar apenas uma função por arquivo