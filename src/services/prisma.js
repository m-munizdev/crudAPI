import { PrismaClient } from "@prisma/client"; // importa o PrismaClient para o arquivo se comunicar com o banco de dados. 
export const prisma = new PrismaClient(); // cria uma instancia do PrismaClient e exporta ela para os outros arquivos.
// Ao inves de toda vez que for comunicar com o banco de dados, importar o PrismaClient, podemos criar uma instancia dele e exportar essa instancia para os outros arquivos.
