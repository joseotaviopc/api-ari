// src/prisma-client-exception.filter.ts

// Importa decoradores e classes do NestJS para manipulação de exceções e HTTP.
// ArgumentsHost: Fornece métodos para obter os argumentos passados para um manipulador (ex: requisição, resposta).
// Catch: Decorador para marcar uma classe como um filtro de exceção, especificando os tipos de exceção a serem capturados.
// HttpStatus: Enum com códigos de status HTTP padrão.
// import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
// Importa BaseExceptionFilter, um filtro de exceção base do NestJS que pode ser estendido.
import { BaseExceptionFilter } from '@nestjs/core';
// Importa tipos do Prisma, especificamente PrismaClientKnownRequestError, que representa erros conhecidos do Prisma Client.
// import { Prisma } from '@prisma/client';
// Importa o tipo Response do Express para tipar o objeto de resposta HTTP.
import { Response } from 'express';

// O decorador @Catch(Prisma.PrismaClientKnownRequestError) especifica que este filtro
// irá capturar exceções do tipo Prisma.PrismaClientKnownRequestError.
// Quando uma exceção desse tipo é lançada em qualquer lugar da aplicação e não é capturada localmente,
// este filtro será invocado.
// @Catch(Prisma.PrismaClientKnownRequestError)
// A classe PrismaClientExceptionFilter estende BaseExceptionFilter.
// Isso permite que ela herde o comportamento padrão de tratamento de exceções do NestJS
// e o sobrescreva ou complemente conforme necessário.
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  // O método catch é o núcleo do filtro de exceção. Ele é chamado quando uma exceção
  // do tipo especificado no @Catch() é interceptada.
  // Parâmetros:
  //   - exception: A instância da exceção capturada (neste caso, Prisma.PrismaClientKnownRequestError).
  //   - host: Um objeto ArgumentsHost que fornece acesso aos argumentos da requisição (ex: request, response).
  // catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
  //   // Loga a mensagem de erro original da exceção no console para fins de depuração.
  //   // É uma boa prática logar o erro completo ou pelo menos a mensagem.
  //   console.error(exception.message);
  //   // Obtém o contexto HTTP da requisição atual a partir do ArgumentsHost.
  //   const ctx = host.switchToHttp();
  //   // Obtém o objeto de resposta (Response do Express) do contexto HTTP.
  //   const response = ctx.getResponse<Response>();
  //   // Formata a mensagem de erro da exceção, removendo quebras de linha para uma melhor apresentação no JSON de resposta.
  //   const message = exception.message.replace(/\n/g, '');
  //   // Um switch para tratar códigos de erro específicos do Prisma.
  //   // Cada 'case' corresponde a um código de erro conhecido do Prisma (ex: 'P2002' para violação de restrição única).
  //   switch (exception.code) {
  //     // Código P2002: Violação de restrição única (ex: tentar criar um registro com um e-mail que já existe).
  //     case 'P2002': {
  //       // Define o status HTTP para CONFLICT (409).
  //       const status = HttpStatus.CONFLICT;
  //       // Envia uma resposta JSON com o status e a mensagem de erro formatada.
  //       response.status(status).json({
  //         statusCode: status,
  //         message: message, // Poderia ser uma mensagem mais amigável aqui, ex: "Já existe um registro com estes dados."
  //       });
  //       break;
  //     }
  //     // Código P2000: O valor fornecido para uma coluna é muito longo.
  //     case 'P2000': {
  //       // Define o status HTTP para BAD_REQUEST (400).
  //       const status = HttpStatus.BAD_REQUEST;
  //       // Envia uma resposta JSON.
  //       response.status(status).json({
  //         statusCode: status,
  //         message: message, // Ex: "O valor fornecido para o campo X é muito longo."
  //       });
  //       break;
  //     }
  //     // Código P2025: Um registro relacionado necessário para a operação não foi encontrado.
  //     // Ex: Tentar atualizar ou deletar um registro que não existe.
  //     case 'P2025': {
  //       // Define o status HTTP para NOT_FOUND (404).
  //       const status = HttpStatus.NOT_FOUND;
  //       // Envia uma resposta JSON.
  //       response.status(status).json({
  //         statusCode: status,
  //         message: message, // Ex: "O recurso que você está tentando modificar não foi encontrado."
  //       });
  //       break;
  //     }
  // Caso padrão: Se o código de erro do Prisma não for um dos tratados acima.
  // default:
  // Delega o tratamento da exceção para o BaseExceptionFilter (o filtro padrão do NestJS).
  // Isso garante que outros erros do Prisma ou erros não previstos ainda sejam tratados
  // de forma genérica (geralmente resultando em um erro 500 Internal Server Error).
  //     super.catch(exception, host);
  //     break;
  // }
  // }
}
