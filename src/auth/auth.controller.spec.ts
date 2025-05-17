/* eslint-disable @typescript-eslint/unbound-method */
// Importa Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o AuthController, o controlador que será testado.
import { AuthController } from './auth.controller';
// Importa o AuthService, uma dependência do AuthController que será mockada.
import { AuthService } from './auth.service';
// Importa o LoginDto para tipar os dados de entrada do método de login.
import { LoginDto } from './dto/login.dto';
// Importa a AuthEntity para tipar o retorno esperado do método de login.
import { AuthEntity } from './entity/auth.entity';

// 'describe' define uma suíte de testes para o AuthController.
describe('AuthController', () => {
  // Declara variáveis para o controlador a ser testado e seu mock de serviço.
  let controller: AuthController;
  let authService: AuthService;

  // 'beforeEach' é um hook que executa antes de cada teste ('it') dentro desta suíte.
  beforeEach(async () => {
    // Cria um módulo de teste NestJS.
    // Este módulo simula o ambiente da sua aplicação para os testes.
    const module: TestingModule = await Test.createTestingModule({
      // Declara os controladores que farão parte deste módulo de teste.
      controllers: [AuthController],
      // Declara os provedores (serviços) que farão parte deste módulo de teste.
      providers: [
        {
          // Fornece um mock para o AuthService.
          // Em vez de usar a implementação real do AuthService, usamos um objeto mockado.
          provide: AuthService,
          useValue: {
            // Mocka o método 'login' do AuthService.
            // jest.fn() cria uma função mock que podemos usar para espionar chamadas e controlar retornos.
            login: jest.fn(),
          },
        },
      ],
    }).compile(); // Compila o módulo de teste.

    // Obtém uma instância do AuthController do módulo de teste.
    controller = module.get<AuthController>(AuthController);
    // Obtém a instância mockada do AuthService do módulo de teste.
    authService = module.get<AuthService>(AuthService);
  });

  // 'it' define um caso de teste individual para verificar se o controlador foi definido.
  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'login'.
  describe('login', () => {
    // 'it' define um caso de teste para o cenário de login bem-sucedido.
    it('deve chamar authService.login com as credenciais corretas e retornar o resultado', async () => {
      // Define um DTO de login mockado para usar como entrada.
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      // Define o resultado esperado do authService.login (um token de acesso).
      const expectedResult: AuthEntity = { accessToken: 'mockAccessToken' };

      // Configura o mock do método authService.login para retornar o expectedResult quando chamado.
      // Usamos 'as jest.Mock' para informar ao TypeScript que esta é uma função mock do Jest.
      (authService.login as jest.Mock).mockResolvedValue(expectedResult);

      // Chama o método login do controlador com o DTO mockado.
      const result = await controller.login(loginDto);

      // Verifica se o método authService.login foi chamado uma vez.
      expect(authService.login).toHaveBeenCalledTimes(1);
      // Verifica se o método authService.login foi chamado com os argumentos corretos (email e senha do DTO).
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      // Verifica se o resultado retornado pelo controlador é igual ao expectedResult.
      expect(result).toEqual(expectedResult);
    });

    // Poderiam ser adicionados mais testes aqui para cenários de erro,
    // mas como o AuthController apenas repassa a chamada para o AuthService,
    // os testes de tratamento de erro (NotFoundException, UnauthorizedException)
    // são mais apropriados no auth.service.spec.ts.
  });
});
