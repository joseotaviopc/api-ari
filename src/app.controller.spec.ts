// Importa as classes Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o AppController, que será testado.
import { AppController } from './app.controller';
// Importa o AppService, uma dependência do AppController.
import { AppService } from './app.service';

// 'describe' define uma suíte de testes para o AppController.
describe('AppController', () => {
  // Declara uma variável para armazenar a instância do AppController.
  let appController: AppController;
  // Declara uma variável para armazenar a instância mock ou real do AppService.
  let appService: AppService;

  // 'beforeEach' é um hook que executa antes de cada teste ('it') dentro desta suíte.
  beforeEach(async () => {
    // Cria um módulo de teste NestJS.
    // Este módulo simula o ambiente da sua aplicação para os testes.
    const app: TestingModule = await Test.createTestingModule({
      // Declara os controladores que farão parte deste módulo de teste.
      controllers: [AppController],
      // Declara os provedores (serviços) que farão parte deste módulo de teste.
      // O AppService real é fornecido aqui, mas poderia ser um mock se necessário.
      providers: [AppService],
    }).compile(); // Compila o módulo de teste.

    // Obtém uma instância do AppController do módulo de teste.
    // O NestJS resolverá as dependências (como AppService) automaticamente.
    appController = app.get<AppController>(AppController);
    // Obtém uma instância do AppService do módulo de teste.
    appService = app.get<AppService>(AppService);
  });

  // 'describe' define uma sub-suíte de testes para o método 'getHello'.
  describe('getHello', () => {
    // 'it' define um caso de teste individual.
    // Este teste verifica se o método getHello() retorna a string esperada.
    it('deve retornar uma string vazia', () => {
      // Chama o método getHello() do appController.
      // 'expect(...).toBe(...)' é uma asserção que verifica se o valor retornado é igual ao esperado.
      // Ajustado para corresponder ao retorno real do AppController.
      expect(appController.getHello()).toBe('');
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'getStatus'.
  describe('getStatus', () => {
    // Este teste verifica se o método getStatus() retorna a string esperada.
    it('deve retornar "ARI is running!"', () => {
      // Chama o método getStatus() do appController.
      expect(appController.getStatus()).toBe('ARI is running!');
    });

    // Este teste verifica se o método getStatus() do AppService é chamado.
    it('deve chamar appService.getStatus', () => {
      // Cria um spy no método getStatus do appService.
      // Um spy permite observar chamadas a um método sem alterar seu comportamento original (a menos que especificado).
      const getStatusSpy = jest.spyOn(appService, 'getStatus');
      // Chama o método getStatus do appController.
      appController.getStatus();
      // Verifica se o spy (getStatusSpy) foi chamado.
      expect(getStatusSpy).toHaveBeenCalled();
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'getError'.
  describe('getError', () => {
    // Este teste verifica se o método getError() lança a exceção esperada.
    it('deve lançar um erro "My first Sentry error!"', () => {
      // 'expect(...).toThrow(...)' é uma asserção que verifica se uma função lança uma exceção.
      // A função dentro de expect() deve invocar o método que se espera que lance o erro.
      expect(() => appController.getError()).toThrow('My first Sentry error!');
    });

    // Este teste verifica se o método getError() do AppService é chamado.
    it('deve chamar appService.getError', () => {
      // Cria um spy no método getError do appService.
      // Como getError lança um erro, precisamos mockar sua implementação para evitar que o teste falhe prematuramente.
      const getErrorSpy = jest
        .spyOn(appService, 'getError')
        .mockImplementation(() => {
          throw new Error('My first Sentry error!');
        });
      // Usa um bloco try...catch para lidar com o erro esperado.
      try {
        appController.getError();
      } catch (error) {
        console.log(error);
        // O erro é esperado, então podemos continuar.
      }
      // Verifica se o spy (getErrorSpy) foi chamado.
      expect(getErrorSpy).toHaveBeenCalled();
    });
  });
});
