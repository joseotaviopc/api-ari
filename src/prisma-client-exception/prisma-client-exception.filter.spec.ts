// Importa o filtro que será testado.
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';
// Importa HttpStatus e ArgumentsHost do NestJS para simular o ambiente de execução.
import { HttpStatus, ArgumentsHost } from '@nestjs/common';
// Importa Prisma para simular erros específicos do PrismaClient.
import { Prisma } from '@prisma/client';
// Importa BaseExceptionFilter para espionar a chamada ao método 'catch' da classe pai.
import { BaseExceptionFilter } from '@nestjs/core';

// Mock para o objeto Response do Express.
// jest.fn() cria funções mock que permitem espionar chamadas, parâmetros e controlar retornos.
const mockResponse = {
  status: jest.fn().mockReturnThis(), // mockReturnThis permite encadear chamadas, ex: response.status(200).json(...)
  json: jest.fn(),
};

// Mock para o objeto HttpArgumentsHost.
const mockHttpArgumentsHost = {
  getResponse: jest.fn().mockReturnValue(mockResponse), // Retorna o mockResponse.
  getRequest: jest.fn(), // Não usado neste teste, mas incluído para completude.
};

// Mock para o objeto ArgumentsHost.
const mockArgumentsHost = {
  switchToHttp: jest.fn().mockReturnValue(mockHttpArgumentsHost), // Retorna o mockHttpArgumentsHost.
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

// 'describe' define uma suíte de testes para o PrismaClientExceptionFilter.
describe('PrismaClientExceptionFilter', () => {
  // Declara uma variável para a instância do filtro.
  let filter: PrismaClientExceptionFilter;
  // Declara uma variável para espionar o método 'catch' da classe pai (BaseExceptionFilter).
  let superCatchSpy: jest.SpyInstance;
  // Declara uma variável para o mock do HttpAdapter.
  let mockHttpAdapter;

  // 'beforeEach' é um hook que executa antes de cada teste ('it') dentro desta suíte.
  beforeEach(() => {
    // Cria um mock para o HttpAdapter.
    mockHttpAdapter = {
      isHeadersSent: jest.fn().mockReturnValue(false), // Necessário para o fluxo do super.catch
      reply: jest.fn(), // Necessário caso o super.catch tente enviar uma resposta
      // Outros métodos como getRequestHostname, getRequestMethod, getRequestUrl podem ser adicionados se necessário.
    };

    // Cria uma nova instância do filtro antes de cada teste.
    // Passamos o mockHttpAdapter para o construtor.
    filter = new PrismaClientExceptionFilter(mockHttpAdapter);
    // Limpa todos os mocks para garantir que os testes sejam independentes.
    jest.clearAllMocks();
    // Cria um spy no método 'catch' do protótipo de BaseExceptionFilter.
    // Isso nos permite verificar se o método 'super.catch()' é chamado no caso padrão.
    superCatchSpy = jest.spyOn(BaseExceptionFilter.prototype, 'catch');
  });

  // 'afterEach' é um hook que executa após cada teste.
  afterEach(() => {
    // Restaura o spy para não interferir em outros testes ou suítes.
    superCatchSpy.mockRestore();
  });

  // 'it' define um caso de teste individual para verificar se o filtro foi definido.
  it('deve ser definido', () => {
    expect(filter).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'catch'.
  describe('catch', () => {
    // Teste para o código de erro P2002 (violação de restrição única).
    it('deve tratar o erro P2002 com HttpStatus.CONFLICT', () => {
      // Cria uma instância mock de PrismaClientKnownRequestError com o código P2002.
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed', // Mensagem do erro.
        {
          code: 'P2002', // Código do erro Prisma.
          clientVersion: '2.19.0', // Versão do cliente Prisma (exemplo).
          meta: { target: ['email'] }, // Metadados opcionais sobre o erro.
        },
      );

      // Chama o método 'catch' do filtro com a exceção e o host mockados.
      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      // Verifica se response.status foi chamado com HttpStatus.CONFLICT.
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      // Verifica se response.json foi chamado com o corpo da resposta esperado.
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed',
      });
      // Verifica se super.catch NÃO foi chamado.
      expect(superCatchSpy).not.toHaveBeenCalled();
    });

    // Teste para o código de erro P2000 (valor muito longo para a coluna).
    it('deve tratar o erro P2000 com HttpStatus.BAD_REQUEST', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Value too long for column',
        {
          code: 'P2000',
          clientVersion: '2.19.0',
          meta: { column_name: 'title' },
        },
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Value too long for column',
      });
      expect(superCatchSpy).not.toHaveBeenCalled();
    });

    // Teste para o código de erro P2025 (registro relacionado não encontrado).
    it('deve tratar o erro P2025 com HttpStatus.NOT_FOUND', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'An operation failed because it depends on one or more records that were required but not found.',
        {
          code: 'P2025',
          clientVersion: '2.19.0',
          meta: { cause: 'Record to delete does not exist.' },
        },
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message:
          'An operation failed because it depends on one or more records that were required but not found.',
      });
      expect(superCatchSpy).not.toHaveBeenCalled();
    });

    // Teste para um código de erro do Prisma não tratado especificamente (caso padrão).
    it('deve chamar super.catch para códigos de erro Prisma não tratados', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Some other Prisma error',
        {
          code: 'PXXXX', // Um código de erro genérico não listado no switch.
          clientVersion: '2.19.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      // Verifica se response.status NÃO foi chamado diretamente pelo nosso filtro.
      expect(mockResponse.status).not.toHaveBeenCalled();
      // Verifica se response.json NÃO foi chamado diretamente pelo nosso filtro.
      expect(mockResponse.json).not.toHaveBeenCalled();
      // Verifica se super.catch FOI chamado com a exceção e o host corretos.
      expect(superCatchSpy).toHaveBeenCalledWith(exception, mockArgumentsHost);
    });

    // Teste para garantir que a mensagem de erro seja formatada (remoção de \n).
    it('deve formatar a mensagem de erro removendo quebras de linha', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Error with\nnewlines',
        {
          code: 'P2002',
          clientVersion: '2.19.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error withnewlines', // Verifica se a mensagem não contém \n.
        }),
      );
    });
  });
});
