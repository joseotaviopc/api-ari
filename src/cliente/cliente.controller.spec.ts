// Importa Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o ClienteController, o controlador que será testado.
import { ClienteController } from './cliente.controller';
// Importa o ClienteService, uma dependência do ClienteController que será mockada.
import { ClienteService } from './cliente.service';
// Importa a ClienteEntity, usada para tipar os retornos esperados.
import { ClienteEntity } from './entity/cliente.entity';
// Importa tipos do Prisma para tipar os dados mockados e DTOs.
import { Prisma } from '@prisma/client';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

// 'describe' define uma suíte de testes para o ClienteController.
describe('ClienteController', () => {
  // Declara variáveis para o controlador a ser testado e seu mock de serviço.
  let controller: ClienteController;
  let service: ClienteService;

  // Define um mock para o ClienteService.
  // Cada método que o controller usa é substituído por uma função mock do Jest.
  const mockClienteService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      // Adiciona o ClienteService (mockado) aos provedores do módulo de teste.
      // Isso resolve a dependência do ClienteController.
      providers: [
        {
          provide: ClienteService,
          useValue: mockClienteService, // Usa o objeto mockado em vez da implementação real.
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
    service = module.get<ClienteService>(ClienteService);

    // Limpa o estado dos mocks antes de cada teste para garantir isolamento.
    jest.clearAllMocks();
  });

  // 'it' define um caso de teste individual para verificar se o controlador foi definido.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'create'.
  describe('create', () => {
    it('deve criar um cliente e retorná-lo', async () => {
      // Define os dados de entrada para a criação.
      const createClienteDto: CreateClienteDto = {
        idPessoa: 1,
        idVendedor: null,
        limiteCredito: new Prisma.Decimal(1000),
        ativo: true,
        negativado: false,
        bloqueado: false,
        // Outros campos obrigatórios conforme seu schema Prisma
        observacao: null,
        score: null,
        ultimaCompra: null,
        valorUltimaCompra: null,
      };
      // Define o cliente mockado que o service retornaria.
      const mockCreatedCliente: ClienteEntity = {
        id: 1,
        criadoEm: new Date(), // Geralmente gerado pelo DB, mas mockamos para o teste
        atualizadoEm: new Date(), // Geralmente gerado pelo DB, mas mockamos para o teste
        ...createClienteDto,
      };

      // Configura o mock do service.create para retornar o cliente mockado.
      mockClienteService.create.mockResolvedValue(mockCreatedCliente);

      // Chama o método create do controller.
      const result = await controller.create(createClienteDto);

      // Verifica se o método create do service foi chamado com os dados corretos.
      expect(() => service.create(createClienteDto)).toHaveBeenCalledWith(
        createClienteDto,
      );
      // Verifica se o resultado retornado pelo controller é o cliente mockado.
      expect(result).toEqual(mockCreatedCliente);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findAll'.
  describe('findAll', () => {
    it('deve retornar um array de clientes', async () => {
      // Define um array de clientes mockado.
      const mockClientes: ClienteEntity[] = [
        {
          id: 1,
          idPessoa: 1,
          idVendedor: null,
          limiteCredito: new Prisma.Decimal(1000),
          ativo: true,
          negativado: false,
          bloqueado: false,
          observacao: null,
          score: null,
          ultimaCompra: null,
          valorUltimaCompra: null,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      ];

      // Configura o mock do service.findAll para retornar o array mockado.
      mockClienteService.findAll.mockResolvedValue(mockClientes);

      // Chama o método findAll do controller.
      const result = await controller.findAll();

      // Verifica se o método findAll do service foi chamado.
      expect(() => service.findAll()).toHaveBeenCalled();
      // Verifica se o resultado retornado pelo controller é o array mockado.
      expect(result).toEqual(mockClientes);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findOne'.
  describe('findOne', () => {
    const clienteId = 1;
    const mockCliente: ClienteEntity = {
      id: clienteId,
      idPessoa: 1,
      idVendedor: null,
      limiteCredito: new Prisma.Decimal(1000),
      ativo: true,
      negativado: false,
      bloqueado: false,
      observacao: null,
      score: null,
      ultimaCompra: null,
      valorUltimaCompra: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    it('deve retornar um cliente se encontrado', async () => {
      // Configura o mock do service.findOne para retornar o cliente mockado.
      mockClienteService.findOne.mockResolvedValue(mockCliente);

      // Chama o método findOne do controller.
      const result = await controller.findOne(clienteId);

      // Verifica se o método findOne do service foi chamado com o ID correto.
      expect(() => service.findOne(clienteId)).toHaveBeenCalledWith(clienteId);
      // Verifica se o resultado retornado pelo controller é o cliente mockado.
      expect(result).toEqual(mockCliente);
    });

    it('deve retornar null se o cliente não for encontrado', async () => {
      const nonExistentId = 999;
      // Configura o mock do service.findOne para retornar null.
      mockClienteService.findOne.mockResolvedValue(null);

      // Chama o método findOne do controller.
      const result = await controller.findOne(nonExistentId);

      // Verifica se o método findOne do service foi chamado com o ID correto.
      expect(() => service.findOne(nonExistentId)).toHaveBeenCalledWith(
        nonExistentId,
      );
      // Verifica se o resultado retornado pelo controller é null.
      expect(result).toBeNull();
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'update'.
  describe('update', () => {
    const clienteId = 1;
    const updateClienteDto: UpdateClienteDto = {
      ativo: false,
      observacao: 'Cliente inativo',
    };
    const mockUpdatedCliente: ClienteEntity = {
      id: clienteId,
      idPessoa: 1,
      idVendedor: null,
      limiteCredito: new Prisma.Decimal(1000),
      ativo: false, // Atualizado
      negativado: false,
      bloqueado: false,
      observacao: 'Cliente inativo', // Atualizado
      score: null,
      ultimaCompra: null,
      valorUltimaCompra: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(), // Geralmente atualizado pelo DB, mas mockamos para o teste
    };

    it('deve atualizar um cliente e retorná-lo', async () => {
      // Configura o mock do service.update para retornar o cliente atualizado mockado.
      mockClienteService.update.mockResolvedValue(mockUpdatedCliente);

      // Chama o método update do controller.
      const result = await controller.update(clienteId, updateClienteDto);

      // Verifica se o método update do service foi chamado com o ID e dados corretos.
      expect(() =>
        service.update(clienteId, updateClienteDto),
      ).toHaveBeenCalledWith(clienteId, updateClienteDto);
      // Verifica se o resultado retornado pelo controller é o cliente atualizado mockado.
      expect(result).toEqual(mockUpdatedCliente);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'delete'.
  describe('delete', () => {
    const clienteId = 1;

    it('deve deletar um cliente', async () => {
      // Configura o mock do service.delete para resolver sem valor (void).
      mockClienteService.delete.mockResolvedValue(undefined);

      // Chama o método delete do controller.
      const result = await controller.delete(clienteId);

      // Verifica se o método delete do service foi chamado com o ID correto.
      expect(() => service.delete(clienteId)).toHaveBeenCalledWith(clienteId);
      // Verifica se o resultado é undefined (conforme o retorno esperado para void).
      expect(result).toBeUndefined();
    });
  });
});
