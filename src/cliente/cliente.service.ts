// Importa o decorador Injectable do NestJS, que marca a classe como um provedor
// que pode ser gerenciado pelo sistema de injeção de dependência do NestJS.
import { Injectable, Logger } from '@nestjs/common';
// Importa o ClienteRepository, que é responsável pela interação com o banco de dados
// para a entidade Cliente.
import { ClienteRepository } from './repository/cliente.repository';
// Importa a ClienteEntity, que define a estrutura de um objeto Cliente
// como ele é retornado pela API (e possivelmente usado internamente).
// import { ClienteEntity } from './entity/cliente.entity';
// Importa tipos do Prisma, especificamente ClienteCreateInput e ClienteUpdateInput,
// que são usados para tipar os dados de entrada para operações de criação e atualização.
// import { Prisma } from '@prisma/client';

// O decorador @Injectable() marca a classe ClienteService para que o NestJS
// possa injetá-la em outros componentes, como controladores.
@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  // O construtor injeta uma instância de ClienteRepository.
  // A palavra-chave 'private readonly' cria e inicializa a propriedade clienteRepository
  // e a torna acessível apenas dentro desta classe, além de impedir sua reassinalação.
  constructor(private readonly clienteRepository: ClienteRepository) {}

  // Método assíncrono para criar um novo cliente.
  // Recebe 'data' do tipo Prisma.ClienteCreateInput, que contém os dados para o novo cliente.
  // Retorna uma Promise que resolve para uma ClienteEntity representando o cliente criado.
  // async create(data: Prisma.ClienteCreateInput): Promise<ClienteEntity> {
  //   // Delega a chamada para o método 'create' do clienteRepository.
  //   return this.clienteRepository.create(data);
  // }

  // Método assíncrono para buscar todos os clientes.
  // Retorna uma Promise que resolve para um array de ClienteEntity.
  async findAll(): Promise<any> {
    this.logger.log('Finding all clientes');
    // Delega a chamada para o método 'findAll' do clienteRepository.
    return this.clienteRepository.findAll();
  }

  // Método assíncrono para atualizar um cliente existente.
  // Recebe o 'id' do cliente a ser atualizado e 'data' do tipo Prisma.ClienteUpdateInput
  // contendo os campos a serem modificados.
  // Retorna uma Promise que resolve para a ClienteEntity atualizada.
  // async update(
  //   id: number,
  //   data: Prisma.ClienteUpdateInput,
  // ): Promise<ClienteEntity> {
  //   // Delega a chamada para o método 'update' do clienteRepository.
  //   return this.clienteRepository.update(id, data);
  // }

  // Método assíncrono para deletar um cliente.
  // Recebe o 'id' do cliente a ser deletado.
  // Retorna uma Promise que resolve para void (indicando que a operação foi concluída,
  // mas não há conteúdo específico para retornar).
  // async delete(id: number): Promise<void> {
  //   // Delega a chamada para o método 'delete' do clienteRepository.
  //   return this.clienteRepository.delete(id);
  // }

  // Método assíncrono para buscar um cliente específico pelo seu ID.
  // Recebe o 'id' do cliente.
  // Retorna uma Promise que resolve para uma ClienteEntity se o cliente for encontrado,
  // ou null caso contrário.
  // async findOne(id: number): Promise<ClienteEntity | null> {
  //   // Delega a chamada para o método 'findOne' do clienteRepository.
  //   return this.clienteRepository.findOne(id);
  // }
}
