/* eslint-disable @typescript-eslint/unbound-method */
// Importa Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o UsersService, o serviço que será testado.
import { UsersService, roundsOfHashing } from './users.service';
// Importa o PrismaService para interagir com o banco de dados (será mockado).
import { PrismaService } from 'nestjs-prisma';
// Importa a biblioteca bcrypt para mockar as funções de hashing.
import * as bcrypt from 'bcrypt';
// Importa tipos do Prisma para tipar os dados mockados.
import { User } from '@prisma/client';
// Importa os DTOs para simular entradas de dados.
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Mocka globalmente o módulo 'bcrypt'.
// Isso substitui a implementação real de bcrypt por mocks durante os testes.
jest.mock('bcrypt');

// 'describe' define uma suíte de testes para o UsersService.
describe('UsersService', () => {
  // Declara variáveis para o serviço a ser testado e seus mocks de dependência.
  let service: UsersService;
  let prismaService: PrismaService;
  // Declara uma variável para o mock da função bcrypt.hash.
  let bcryptHash: jest.Mock;

  // 'beforeEach' é um hook que executa antes de cada teste ('it') dentro desta suíte.
  beforeEach(async () => {
    // Atribui o mock de bcrypt.hash à variável.
    bcryptHash = bcrypt.hash as jest.Mock;

    // Cria um módulo de teste NestJS.
    const module: TestingModule = await Test.createTestingModule({
      // Declara os provedores que farão parte deste módulo de teste.
      providers: [
        UsersService, // O serviço real que estamos testando.
        {
          // Fornece um mock para o PrismaService.
          provide: PrismaService,
          useValue: {
            // Mocka os métodos do Prisma Client que são usados pelo UsersService.
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile(); // Compila o módulo de teste.

    // Obtém instâncias do serviço e dos mocks do módulo de teste.
    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Limpa todos os mocks antes de cada teste para garantir isolamento.
    jest.clearAllMocks();
  });

  // 'it' define um caso de teste individual para verificar se o serviço foi definido.
  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'create'.
  describe('create', () => {
    it('deve criar um usuário com senha hasheada e retorná-lo', async () => {
      // Define o DTO de criação de usuário.
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'Test User',
        password: 'password123',
      };
      // Define a senha hasheada esperada.
      const hashedPassword = 'hashedPassword123';
      // Define o usuário criado esperado.
      const createdUser = {
        ...createUserDto,
        id: 1,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Configura o mock de bcrypt.hash para retornar a senha hasheada.
      bcryptHash.mockResolvedValue(hashedPassword);
      // Configura o mock de prismaService.user.create para retornar o usuário criado.
      (prismaService.user.create as jest.Mock).mockResolvedValue(createdUser);

      // Chama o método create do serviço.
      const result = await service.create(createUserDto);

      // Verifica se bcrypt.hash foi chamado com a senha correta e o número de rounds.
      expect(bcryptHash).toHaveBeenCalledWith(
        createUserDto.password,
        roundsOfHashing,
      );
      // Verifica se prismaService.user.create foi chamado com os dados corretos (incluindo a senha hasheada).
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: hashedPassword },
      });
      // Verifica se o resultado é o usuário criado esperado.
      expect(result).toEqual(createdUser);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findAll'.
  describe('findAll', () => {
    it('deve retornar um array de usuários', async () => {
      // Define um array de usuários mockado.
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'test1@example.com',
          username: 'User One',
          password: 'p1',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'test2@example.com',
          username: 'User Two',
          password: 'p2',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      // Configura o mock de prismaService.user.findMany para retornar o array de usuários.
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      // Chama o método findAll do serviço.
      const result = await service.findAll();

      // Verifica se prismaService.user.findMany foi chamado.
      expect(prismaService.user.findMany).toHaveBeenCalled();
      // Verifica se o resultado é o array de usuários esperado.
      expect(result).toEqual(mockUsers);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findOne'.
  describe('findOne', () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'Test User',
      password: 'p1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve retornar um usuário se encontrado', async () => {
      // Configura o mock de prismaService.user.findUnique para retornar o usuário mockado.
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Chama o método findOne do serviço.
      const result = await service.findOne(userId);

      // Verifica se prismaService.user.findUnique foi chamado com o ID correto.
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      // Verifica se o resultado é o usuário esperado.
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      // Configura o mock de prismaService.user.findUnique para retornar null.
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Chama o método findOne do serviço.
      const result = await service.findOne(userId);

      // Verifica se prismaService.user.findUnique foi chamado.
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      // Verifica se o resultado é null.
      expect(result).toBeNull();
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findByEmail'.
  describe('findByEmail', () => {
    const userEmail = 'test@example.com';
    const mockUser: User = {
      id: 1,
      email: userEmail,
      username: 'Test User',
      password: 'p1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve retornar um usuário se encontrado pelo e-mail', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findByEmail(userEmail);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se o usuário não for encontrado pelo e-mail', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findByEmail(userEmail);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
      expect(result).toBeNull();
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'update'.
  describe('update', () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = { username: 'Updated Name' };
    const updatedUser = {
      id: userId,
      email: 'test@example.com',
      name: 'Updated Name',
      password: 'p1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve atualizar um usuário (sem alterar senha) e retorná-lo', async () => {
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
      // Verifica se bcrypt.hash NÃO foi chamado, pois a senha não está no DTO.
      expect(bcryptHash).not.toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('deve atualizar um usuário (com alteração de senha) e retorná-lo', async () => {
      const updateUserWithPasswordDto: UpdateUserDto = {
        ...updateUserDto,
        password: 'newPassword123',
      };
      const hashedPassword = 'hashedNewPassword123';
      const userWithNewPassword = { ...updatedUser, password: hashedPassword };

      bcryptHash.mockResolvedValue(hashedPassword);
      (prismaService.user.update as jest.Mock).mockResolvedValue(
        userWithNewPassword,
      );

      const result = await service.update(userId, updateUserWithPasswordDto);

      expect(bcryptHash).toHaveBeenCalledWith(
        updateUserWithPasswordDto.password,
        roundsOfHashing,
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { ...updateUserWithPasswordDto, password: hashedPassword },
      });
      expect(result).toEqual(userWithNewPassword);
    });

    // O UsersService não trata diretamente a exceção P2025 (usuário não encontrado para update).
    // O Prisma Client lançaria essa exceção. O teste aqui verifica se o método update do Prisma é chamado.
    // Testar o lançamento da exceção P2025 seria mais apropriado no filtro de exceções ou no controller.
  });

  // 'describe' define uma sub-suíte de testes para o método 'remove'.
  describe('remove', () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'Test User',
      password: 'p1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve remover um usuário e retorná-lo', async () => {
      (prismaService.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.remove(userId);

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });

    // Similar ao update, o UsersService não trata diretamente a exceção P2025 para remove.
    // O teste verifica se o método delete do Prisma é chamado.
  });
});
