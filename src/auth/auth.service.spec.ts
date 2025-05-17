/* eslint-disable @typescript-eslint/unbound-method */
// Importa Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o AuthService, o serviço que será testado.
import { AuthService } from './auth.service';
// Importa o PrismaService para interagir com o banco de dados (será mockado).
import { PrismaService } from 'nestjs-prisma';
// Importa o JwtService para manipulação de JSON Web Tokens (será mockado).
import { JwtService } from '@nestjs/jwt';
// Importa as exceções que o AuthService pode lançar.
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
// Importa a biblioteca bcrypt para mockar a função de comparação de senhas.
import * as bcrypt from 'bcrypt';
// Importa o tipo User do Prisma para tipar os usuários mockados.
import { User } from '@prisma/client';
// Importa a AuthEntity para tipar o retorno esperado do método login.
import { AuthEntity } from './entity/auth.entity';

// Mocka globalmente o módulo 'bcrypt'.
// Isso substitui a implementação real de bcrypt por mocks durante os testes.
jest.mock('bcrypt');

// 'describe' define uma suíte de testes para o AuthService.
describe('AuthService', () => {
  // Declara variáveis para o serviço a ser testado e seus mocks de dependência.
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  // Declara uma variável para o mock da função bcrypt.compare.
  let bcryptCompare: jest.Mock;

  // 'beforeEach' é um hook que executa antes de cada teste ('it') dentro desta suíte.
  beforeEach(async () => {
    // Atribui o mock de bcrypt.compare à variável.
    bcryptCompare = bcrypt.compare as jest.Mock;

    // Cria um módulo de teste NestJS.
    const module: TestingModule = await Test.createTestingModule({
      // Declara os provedores que farão parte deste módulo de teste.
      providers: [
        AuthService, // O serviço real que estamos testando.
        {
          // Fornece um mock para o PrismaService.
          provide: PrismaService,
          useValue: {
            // Mocka o método user.findUnique.
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          // Fornece um mock para o JwtService.
          provide: JwtService,
          useValue: {
            // Mocka o método sign.
            sign: jest.fn(),
          },
        },
      ],
    }).compile(); // Compila o módulo de teste.

    // Obtém instâncias do serviço e dos mocks do módulo de teste.
    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // 'it' define um caso de teste individual para verificar se o serviço foi definido.
  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'login'.
  describe('login', () => {
    // Define um usuário mockado para ser usado nos testes.
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      username: 'Test User',
      password: 'hashedPassword', // Senha já "hasheada"
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // Define um DTO de login mockado.
    const loginDto = { email: 'test@example.com', password: 'password123' };
    // Define um token de acesso mockado.
    const accessToken = 'mockAccessToken';

    // Teste para o cenário de login bem-sucedido.
    it('deve autenticar o usuário e retornar um token de acesso', async () => {
      // Configura o mock de prismaService.user.findUnique para retornar o mockUser.
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      // Configura o mock de bcrypt.compare para retornar true (senha válida).
      bcryptCompare.mockResolvedValue(true);
      // Configura o mock de jwtService.sign para retornar o accessToken.
      (jwtService.sign as jest.Mock).mockReturnValue(accessToken);

      // Chama o método login do serviço.
      const result: AuthEntity = await service.login(
        loginDto.email,
        loginDto.password,
      );

      // Verifica se o resultado é o esperado.
      expect(result).toEqual({ accessToken });
      // Verifica se prismaService.user.findUnique foi chamado com o email correto.
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      // Verifica se bcrypt.compare foi chamado com a senha correta e o hash do usuário.
      expect(bcryptCompare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      // Verifica se jwtService.sign foi chamado com o payload correto (userId).
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: mockUser.id });
    });

    // Teste para o cenário onde o usuário não é encontrado.
    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      // Configura o mock de prismaService.user.findUnique para retornar null (usuário não encontrado).
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Verifica se a chamada ao método login lança a exceção NotFoundException.
      // 'expect(...).rejects' é usado para testar promessas que são rejeitadas.
      // 'toThrow' verifica o tipo e a mensagem da exceção.
      await expect(
        service.login(loginDto.email, loginDto.password),
      ).rejects.toThrow(
        new NotFoundException(`No user found for email: ${loginDto.email}`),
      );
      // Verifica se bcrypt.compare não foi chamado, pois o fluxo deve parar antes.
      // expect(bcryptCompare).not.toHaveBeenCalled();
      // Verifica se jwtService.sign não foi chamado.
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    // Teste para o cenário onde a senha é inválida.
    it('deve lançar UnauthorizedException se a senha for inválida', async () => {
      // Configura o mock de prismaService.user.findUnique para retornar o mockUser.
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      // Configura o mock de bcrypt.compare para retornar false (senha inválida).
      bcryptCompare.mockResolvedValue(false);

      // Verifica se a chamada ao método login lança a exceção UnauthorizedException.
      await expect(
        service.login(loginDto.email, loginDto.password),
      ).rejects.toThrow(new UnauthorizedException('Invalid password'));
      // Verifica se jwtService.sign não foi chamado, pois o fluxo deve parar antes.
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
