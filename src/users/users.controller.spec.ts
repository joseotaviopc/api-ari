/* eslint-disable @typescript-eslint/unbound-method */
// Importa Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o UsersController, o controlador que será testado.
import { UsersController } from './users.controller';
// Importa o UsersService, uma dependência do UsersController que será mockada.
import { UsersService } from './users.service';
// Importa os DTOs para simular entradas de dados.
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Importa a UserEntity para verificar o tipo de retorno dos métodos do controller.
import { UserEntity } from './entities/user.entity';
// Importa NotFoundException para testar o cenário de usuário não encontrado.
import { NotFoundException } from '@nestjs/common';
// Importa o tipo User do Prisma para tipar os usuários mockados.
import { User } from '@prisma/client';

// 'describe' define uma suíte de testes para o UsersController.
describe('UsersController', () => {
  // Declara variáveis para o controlador a ser testado e seu mock de serviço.
  let controller: UsersController;
  let service: UsersService;

  // Define um usuário mockado base para ser usado nos testes.
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'Test User', // Corrigido de 'name' para 'username' para consistência com o DTO
    password: 'hashedPassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Define um mock para o UsersService.
  // Cada método que o controller usa é substituído por uma função mock do Jest.
  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // 'beforeEach' é um hook que executa antes de cada teste ('it') dentro desta suíte.
  beforeEach(async () => {
    // Cria um módulo de teste NestJS.
    // Este módulo simula o ambiente da sua aplicação para os testes.
    const module: TestingModule = await Test.createTestingModule({
      // Declara os controladores que farão parte deste módulo de teste.
      controllers: [UsersController],
      // Declara os provedores (serviços) que farão parte deste módulo de teste.
      providers: [
        {
          // Fornece o mockUsersService em vez da implementação real do UsersService.
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile(); // Compila o módulo de teste.

    // Obtém uma instância do UsersController do módulo de teste.
    controller = module.get<UsersController>(UsersController);
    // Obtém a instância mockada do UsersService do módulo de teste.
    service = module.get<UsersService>(UsersService);
  });

  // 'it' define um caso de teste individual para verificar se o controlador foi definido.
  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'create'.
  describe('create', () => {
    it('deve criar um usuário e retorná-lo como UserEntity', async () => {
      // Define o DTO de criação de usuário.
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        username: 'New User',
        password: 'password123',
      };
      // Configura o mock de service.create para retornar o mockUser.
      mockUsersService.create.mockResolvedValue(mockUser);

      // Chama o método create do controller.
      const result = await controller.create(createUserDto);

      // Verifica se service.create foi chamado com o DTO correto.
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      // Verifica se o resultado é uma instância de UserEntity.
      expect(result).toBeInstanceOf(UserEntity);
      // Verifica se o UserEntity contém os dados do mockUser.
      expect(result.email).toEqual(mockUser.email);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findAll'.
  describe('findAll', () => {
    it('deve retornar um array de UserEntity', async () => {
      // Configura o mock de service.findAll para retornar um array contendo o mockUser.
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      // Chama o método findAll do controller.
      const result = await controller.findAll();

      // Verifica se service.findAll foi chamado.
      expect(service.findAll).toHaveBeenCalled();
      // Verifica se o resultado é um array.
      expect(Array.isArray(result)).toBe(true);
      // Verifica se o primeiro elemento do array é uma instância de UserEntity.
      expect(result[0]).toBeInstanceOf(UserEntity);
      // Verifica se o UserEntity contém os dados do mockUser.
      expect(result[0].email).toEqual(mockUser.email);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findOne'.
  describe('findOne', () => {
    it('deve retornar um UserEntity se o usuário for encontrado', async () => {
      // Configura o mock de service.findOne para retornar o mockUser.
      mockUsersService.findOne.mockResolvedValue(mockUser);

      // Chama o método findOne do controller.
      const result = await controller.findOne(mockUser.id);

      // Verifica se service.findOne foi chamado com o ID correto.
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
      // Verifica se o resultado é uma instância de UserEntity.
      expect(result).toBeInstanceOf(UserEntity);
      // Verifica se o UserEntity contém os dados do mockUser.
      expect(result.id).toEqual(mockUser.id);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const userId = 999;
      // Configura o mock de service.findOne para retornar null (usuário não encontrado).
      mockUsersService.findOne.mockResolvedValue(null);

      // Verifica se a chamada ao controller.findOne lança a exceção NotFoundException.
      // 'expect(...).rejects' é usado para testar promessas que são rejeitadas.
      // 'toThrow' verifica o tipo e a mensagem da exceção.
      await expect(controller.findOne(userId)).rejects.toThrow(
        new NotFoundException(`Usuário não encontrado com o ID ${userId}`),
      );
      // Verifica se service.findOne foi chamado com o ID correto.
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'update'.
  describe('update', () => {
    it('deve atualizar um usuário e retorná-lo como UserEntity', async () => {
      // Define o DTO de atualização de usuário.
      const updateUserDto: UpdateUserDto = { username: 'Updated User' };
      // Define o usuário atualizado esperado.
      const updatedUser = { ...mockUser, username: 'Updated User' };
      // Configura o mock de service.update para retornar o usuário atualizado.
      mockUsersService.update.mockResolvedValue(updatedUser);

      // Chama o método update do controller.
      const result = await controller.update(mockUser.id, updateUserDto);

      // Verifica se service.update foi chamado com o ID e DTO corretos.
      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      // Verifica se o resultado é uma instância de UserEntity.
      expect(result).toBeInstanceOf(UserEntity);
      // Verifica se o UserEntity contém os dados atualizados.
      expect(result.username).toEqual('Updated User');
    });
    // Nota: O UsersController não trata explicitamente o NotFoundException para update,
    // ele delega isso ao UsersService ou ao filtro de exceção global.
    // Testar esse cenário no controller seria mais um teste de integração ou e2e.
  });

  // 'describe' define uma sub-suíte de testes para o método 'remove'.
  describe('remove', () => {
    it('deve remover um usuário e retorná-lo como UserEntity', async () => {
      // Configura o mock de service.remove para retornar o mockUser (o usuário removido).
      mockUsersService.remove.mockResolvedValue(mockUser);

      // Chama o método remove do controller.
      const result = await controller.remove(mockUser.id);

      // Verifica se service.remove foi chamado com o ID correto.
      expect(service.remove).toHaveBeenCalledWith(mockUser.id);
      // Verifica se o resultado é uma instância de UserEntity.
      expect(result).toBeInstanceOf(UserEntity);
      // Verifica se o UserEntity contém os dados do usuário removido.
      expect(result.id).toEqual(mockUser.id);
    });
    // Nota: Similar ao update, o tratamento de NotFoundException para remove
    // é geralmente delegado.
  });
});
