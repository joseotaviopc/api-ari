// Importa Test e TestingModule do NestJS para criar um ambiente de teste.
import { Test, TestingModule } from '@nestjs/testing';
// Importa o ClienteService, o serviço que será testado.
import { ClienteService } from './cliente.service';
// Importa o ClienteRepository, uma dependência do ClienteService que será mockada.
import { ClienteRepository } from './repository/cliente.repository';
// Importa a ClienteEntity para tipar os retornos esperados.
import { ClienteEntity } from './entity/cliente.entity';
// Importa tipos do Prisma para tipar os dados mockados e DTOs.
import { Prisma } from '@prisma/client';

// 'describe' define uma suíte de testes para o ClienteService.
describe('ClienteService', () => {
  // Declara variáveis para o serviço a ser testado e seu mock de repositório.
  let service: ClienteService;
  let repository: ClienteRepository;

  // Define um mock para o ClienteRepository.
  // Cada método que o serviço usa é substituído por uma função mock do Jest.
  const mockClienteRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    // Cria um módulo de teste NestJS.
    const module: TestingModule = await Test.createTestingModule({
      // Declara os provedores que farão parte deste módulo de teste.
      providers: [
        ClienteService, // O serviço real que estamos testando.
        {
          // Fornece um mock para o ClienteRepository.
          provide: ClienteRepository,
          useValue: mockClienteRepository, // Usa o objeto mockado em vez da implementação real.
        },
      ],
    }).compile(); // Compila o módulo de teste.

    // Obtém instâncias do serviço e do mock do repositório do módulo de teste.
    service = module.get<ClienteService>(ClienteService);
    repository = module.get<ClienteRepository>(ClienteRepository);

    // Limpa o estado dos mocks antes de cada teste para garantir isolamento.
    jest.clearAllMocks();
  });

  // 'it' define um caso de teste individual para verificar se o serviço foi definido.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 'describe' define uma sub-suíte de testes para o método 'create'.
  describe('create', () => {
    it('deve chamar repository.create e retornar o resultado', async () => {
      const createDto: Prisma.ClienteCreateInput = {
        idPessoa: 1,
        limiteCredito: 1000,
        ativo: true,
        negativado: false,
        bloqueado: false,
      };
      const expectedResult = {
        id: 1,
        ...createDto,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        idVendedor: null,
        observacao: null,
        score: null,
        ultimaCompra: null,
        valorUltimaCompra: null,
      } as ClienteEntity;
      mockClienteRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);
      expect(() => repository.create(createDto)).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findAll'.
  describe('findAll', () => {
    it('deve chamar repository.findAll e retornar o resultado', async () => {
      const expectedResult: ClienteEntity[] = [
        {
          id: 1,
          idPessoa: 1,
          limiteCredito: new Prisma.Decimal(1000),
          ativo: true,
          negativado: false,
          bloqueado: false,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          idVendedor: null,
          observacao: null,
          score: null,
          ultimaCompra: null,
          valorUltimaCompra: null,
        },
      ];
      mockClienteRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();
      expect(() => repository.findAll()).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'findOne'.
  describe('findOne', () => {
    it('deve chamar repository.findOne e retornar o resultado se encontrado', async () => {
      const id = 1;
      const expectedResult: ClienteEntity = {
        id: 1,
        idPessoa: 1,
        limiteCredito: new Prisma.Decimal(1000),
        ativo: true,
        negativado: false,
        bloqueado: false,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        idVendedor: null,
        observacao: null,
        score: null,
        ultimaCompra: null,
        valorUltimaCompra: null,
      };
      mockClienteRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);
      expect(() => repository.findOne(id)).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('deve chamar repository.findOne e retornar null se não encontrado', async () => {
      const id = 999;
      mockClienteRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(id);
      expect(() => repository.findOne(id)).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'update'.
  describe('update', () => {
    it('deve chamar repository.update e retornar o resultado', async () => {
      const id = 1;
      const updateDto: Prisma.ClienteUpdateInput = { ativo: false };
      const expectedResult: ClienteEntity = {
        id: 1,
        idPessoa: 1,
        limiteCredito: new Prisma.Decimal(1000),
        ativo: false,
        negativado: false,
        bloqueado: false,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        idVendedor: null,
        observacao: null,
        score: null,
        ultimaCompra: null,
        valorUltimaCompra: null,
      };
      mockClienteRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);
      expect(() => repository.update(id, updateDto)).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  // 'describe' define uma sub-suíte de testes para o método 'delete'.
  describe('delete', () => {
    it('deve chamar repository.delete', async () => {
      const id = 1;
      mockClienteRepository.delete.mockResolvedValue(undefined); // Retorna void

      await service.delete(id);
      expect(() => repository.delete(id)).toHaveBeenCalled();
    });
  });
});
