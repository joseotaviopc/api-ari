// Importa os decoradores Controller e Get do NestJS.
// Controller é usado para definir uma classe como um controlador, que lida com requisições HTTP.
// Get é usado para definir um método como um manipulador de requisições HTTP GET.
import { Controller, Get } from '@nestjs/common';
// Importa o AppService, que contém a lógica de negócios da aplicação.
import { AppService } from './app.service';

// Define a classe AppController como um controlador.
// O decorador @Controller() sem argumentos define este controlador como o controlador raiz da aplicação.
// Requisições para a raiz da aplicação (ex: http://localhost:3000/) serão manipuladas por este controlador.
@Controller()
export class AppController {
  // O construtor injeta uma instância de AppService.
  // O modificador 'private readonly' cria e inicializa o membro appService na mesma linha.
  // Este serviço será usado pelos métodos do controlador para executar a lógica de negócios.
  constructor(private readonly appService: AppService) {}

  // Define um manipulador para requisições HTTP GET para a rota raiz ('/').
  // Este método é chamado quando uma requisição GET é feita para a raiz da aplicação.
  @Get()
  getHello(): string {
    // Atualmente, retorna uma string vazia.
    // Em uma aplicação real, este método poderia retornar uma página inicial, uma mensagem de boas-vindas, etc.
    // No arquivo app.controller.spec.ts, o teste espera "Hello World!".
    // Seria bom alinhar este retorno com o teste ou atualizar o teste.
    return '';
  }

  // Define um manipulador para requisições HTTP GET para a rota '/status'.
  // Este método é chamado quando uma requisição GET é feita para http://localhost:3000/status.
  @Get('status')
  getStatus(): string {
    // Chama o método getStatus() do AppService e retorna o resultado.
    // Este método é usado para verificar o status da aplicação.
    return this.appService.getStatus();
  }

  // Define um manipulador para requisições HTTP GET para a rota '/debug-sentry'.
  // Este método é chamado quando uma requisição GET é feita para http://localhost:3000/debug-sentry.
  @Get('debug-sentry')
  getError() {
    // Chama o método getError() do AppService.
    // Este método é projetado para lançar um erro, que será capturado pelo Sentry para fins de depuração.
    return this.appService.getError();
  }
}
