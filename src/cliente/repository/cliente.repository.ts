// src/modules/cliente/repository/cliente.repository.ts
// Importa o decorador Injectable do NestJS, que marca a classe como um provedor
// que pode ser gerenciado pelo sistema de injeção de dependência do NestJS.
import { Injectable, Logger } from '@nestjs/common';
// Importa o PrismaService, um serviço que encapsula o Prisma Client e facilita
// a interação com o banco de dados de forma segura e eficiente.
import { PrismaService } from 'nestjs-prisma';
// Importa a ClienteEntity, que define a estrutura de um objeto Cliente
// como ele é retornado pela API e usado internamente.
// import { ClienteEntity } from '../entity/cliente.entity';
// Importa tipos do Prisma, como ClienteCreateInput e ClienteUpdateInput,
// que são usados para tipar os dados de entrada para operações de criação e atualização.
// import { Prisma } from '@prisma/client';

// O decorador @Injectable() marca a classe ClienteRepository para que o NestJS
// possa injetá-la em outros componentes, como serviços.
@Injectable()
export class ClienteRepository {
  private readonly logger = new Logger(ClienteRepository.name);
  // O construtor injeta uma instância de PrismaService.
  // A palavra-chave 'private readonly' cria e inicializa a propriedade prisma
  // e a torna acessível apenas dentro desta classe, além de impedir sua reassinalação.
  constructor(private readonly prisma: PrismaService) {}

  // Método assíncrono para criar um novo cliente no banco de dados.
  // Recebe 'data' do tipo Prisma.ClienteCreateInput, contendo os dados para o novo cliente.
  // Retorna uma Promise que resolve para uma ClienteEntity representando o cliente criado.
  // async create(data: Prisma.ClienteCreateInput): Promise<ClienteEntity> {
  //   try {
  //     // Utiliza o Prisma Client para executar a operação de criação na tabela 'cliente'.
  //     const result = await this.prisma.cliente.create({
  //       data,
  //     });
  //     // Verifica se o resultado da criação é nulo ou indefinido, o que não deveria acontecer
  //     // em uma operação de criação bem-sucedida com o Prisma.
  //     if (!result) {
  //       throw new Error('Failed to create cliente: No result returned');
  //     }
  //     // Retorna o cliente criado. O Prisma já retorna um objeto que corresponde à entidade.
  //     return result;
  //   } catch (error: unknown) {
  //     // Captura qualquer erro ocorrido durante a operação.
  //     console.error('Error creating cliente:', error);
  //     // Se o erro já for uma instância de Error, relança-o.
  //     if (error instanceof Error) {
  //       throw error;
  //     }
  //     // Caso contrário, lança um novo erro genérico com a mensagem original do erro.
  //     throw new Error(`Failed to create cliente: ${JSON.stringify(error)}`);
  //   }
  // }

  // Método assíncrono para atualizar um cliente existente no banco de dados.
  // Recebe o 'id' do cliente a ser atualizado e 'data' do tipo Prisma.ClienteUpdateInput
  // contendo os campos a serem modificados.
  // Retorna uma Promise que resolve para a ClienteEntity atualizada.
  // async update(
  //   id: number,
  //   data: Prisma.ClienteUpdateInput,
  // ): Promise<ClienteEntity> {
  //   try {
  //     // Utiliza o Prisma Client para executar a operação de atualização.
  //     // 'where: { id }' especifica qual cliente atualizar.
  //     const result = await this.prisma.cliente.update({
  //       where: { id },
  //       data,
  //     });
  //     // O Prisma lança uma exceção (PrismaClientKnownRequestError com código P2025)
  //     // se nenhum cliente com o ID fornecido for encontrado.
  //     // A verificação '!result' aqui é uma salvaguarda adicional, embora o Prisma já trate o "não encontrado".
  //     if (!result) {
  //       throw new Error('Failed to update cliente: No result returned');
  //     }
  //     return result;
  //   } catch (error: unknown) {
  //     console.error('Error updating cliente:', error);
  //     if (error instanceof Error) {
  //       throw error;
  //     }
  //     throw new Error(`Failed to update cliente: ${JSON.stringify(error)}`);
  //   }
  // }

  // Método assíncrono para deletar um cliente do banco de dados.
  // Recebe o 'id' do cliente a ser deletado.
  // Retorna uma Promise que resolve para void (indicando que a operação foi concluída).
  // async delete(id: number): Promise<void> {
  //   try {
  //     // Utiliza o Prisma Client para executar a operação de deleção.
  //     // O Prisma lança uma exceção (PrismaClientKnownRequestError com código P2025)
  //     // se nenhum cliente com o ID fornecido for encontrado.
  //     await this.prisma.cliente.delete({
  //       where: { id },
  //     });
  //     // Não há retorno explícito, pois a operação de delete bem-sucedida não retorna dados.
  //   } catch (error: unknown) {
  //     console.error('Error deleting cliente:', error);
  //     if (error instanceof Error) {
  //       throw error;
  //     }
  //     throw new Error(`Failed to delete cliente: ${JSON.stringify(error)}`);
  //   }
  // }

  // Método assíncrono para buscar todos os clientes no banco de dados.
  // Retorna uma Promise que resolve para um array de ClienteEntity.
  async findAll(): Promise<any> {
    try {
      // Utiliza o Prisma Client para buscar todos os registros da tabela 'cliente'.
      const result = await this.prisma.empresa.findMany();
      // findMany retorna um array vazio se não houver clientes, não null.
      // A verificação '!result' pode ser redundante ou mal interpretada aqui,
      // pois um array vazio é um resultado válido.
      this.logger.log('Found all clientes');
      if (!result) {
        throw new Error('Failed to find all clientes: No result returned');
      }
      // Convert BigInt to string for safe JSON serialization
      return result.map((empresa) => ({
        ...empresa,
        id: empresa.id.toString(), // Convert BigInt to string
      }));
    } catch (error: unknown) {
      console.error('Error finding all clientes:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to find all clientes: ${JSON.stringify(error)}`);
    }
  }

  // Método assíncrono para buscar um cliente específico pelo seu ID.
  // Recebe o 'id' do cliente.
  // Retorna uma Promise que resolve para uma ClienteEntity se o cliente for encontrado,
  // ou null caso contrário (comportamento padrão do Prisma para findUnique).
  // async findOne(id: number): Promise<ClienteEntity | null> {
  //   try {
  //     // Utiliza o Prisma Client para buscar um cliente único pelo ID.
  //     const result = await this.prisma.cliente.findUnique({
  //       where: { id },
  //     });
  //     // findUnique retorna o objeto encontrado ou null se não encontrar.
  //     // Não é necessário lançar um erro aqui se o resultado for null,
  //     // pois isso é um comportamento esperado e deve ser tratado pelo serviço ou controlador.
  //     return result;
  //   } catch (error: unknown) {
  //     console.error('Error finding cliente by id:', error);
  //     if (error instanceof Error) {
  //       throw error;
  //     }
  //     throw new Error(`Failed to find cliente by id: ${JSON.stringify(error)}`);
  //   }
  // }
}
