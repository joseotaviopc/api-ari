// src/cliente/entity/cliente.entity.ts

// Importa o decorador ApiProperty do Swagger para documentar as propriedades da entidade na API.
import { ApiProperty } from '@nestjs/swagger';
// Importa o tipo Cliente do Prisma Client. Este tipo representa a estrutura de um cliente no banco de dados.
// import { Cliente } from '@prisma/client';
// Importa o tipo Decimal da biblioteca Prisma para representar valores monetários ou de precisão.
// Nota: O caminho 'generated/prisma/runtime/library' pode variar dependendo da sua configuração do Prisma.
// Geralmente, é importado diretamente de '@prisma/client/runtime/library' ou similar se você precisar do tipo explicitamente.
// No entanto, ao implementar a interface Cliente, o tipo Decimal já é inferido.
import { Decimal } from '@prisma/client/runtime/library'; // Ajustado para um caminho mais comum, se necessário.

// Define a classe ClienteEntity.
// Esta classe implementa a interface Cliente do Prisma, garantindo que ela tenha todas as propriedades de um cliente do banco de dados.
// ClienteEntity é usada para representar clientes nas respostas da API, permitindo controle sobre quais dados são expostos
// e como eles são documentados no Swagger.
export class ClienteEntity {
  // O construtor permite criar uma instância de ClienteEntity a partir de um objeto parcial.
  // Object.assign(this, partial) copia as propriedades do objeto 'partial' para a nova instância de ClienteEntity.
  // Isso é útil para converter objetos de cliente do Prisma (ou DTOs) em instâncias de ClienteEntity.
  constructor(partial: Partial<ClienteEntity>) {
    Object.assign(this, partial);
  }

  // O decorador @ApiProperty() informa ao Swagger para incluir esta propriedade na documentação da API.
  // Define a propriedade 'id' do tipo número, que é o identificador único do cliente.
  @ApiProperty({ description: 'O ID único do cliente.', example: 1 })
  id: number;

  // @ApiProperty() documenta o ID da pessoa associada a este cliente.
  // Presumivelmente, refere-se a uma tabela 'Pessoa' separada.
  @ApiProperty({
    description: 'O ID da pessoa física ou jurídica associada ao cliente.',
    example: 101,
  })
  idPessoa: number;

  // @ApiProperty() documenta o ID do vendedor associado a este cliente.
  // Presumivelmente, refere-se a uma tabela 'Vendedor' ou 'Usuario' com perfil de vendedor.
  @ApiProperty({
    description: 'O ID do vendedor responsável por este cliente.',
    example: 201,
  })
  idVendedor: number | null;

  // @ApiProperty() documenta o limite de crédito do cliente.
  // O tipo Decimal é usado para valores monetários para garantir precisão.
  @ApiProperty({
    description: 'O limite de crédito concedido ao cliente.',
    type: 'number', // Para o Swagger, representamos Decimal como 'number'
    format: 'double', // ou 'float', dependendo da precisão desejada na documentação
    example: 1000.5,
  })
  limiteCredito: Decimal;

  // @ApiProperty() documenta o status de ativação do cliente.
  @ApiProperty({
    description: 'Indica se o cliente está ativo no sistema.',
    example: true,
  })
  ativo: boolean;

  // @ApiProperty() documenta um campo de observação para o cliente.
  // Pode ser nulo se não houver observações.
  @ApiProperty({
    description: 'Observações gerais sobre o cliente.',
    example: 'Cliente prefere contato por e-mail.',
    required: false,
    nullable: true,
  })
  observacao: string | null; // Ajustado para refletir que pode ser string ou null, comum para observações.

  // @ApiProperty() documenta o score de crédito ou pontuação do cliente.
  // Pode ser nulo se não aplicável ou não calculado.
  @ApiProperty({
    description: 'Score de crédito ou pontuação do cliente.',
    example: 750,
    required: false,
    nullable: true,
  })
  score: number | null; // Ajustado para refletir que pode ser number ou null.

  // @ApiProperty() documenta a data da última compra realizada pelo cliente.
  // Pode ser nulo se o cliente nunca comprou.
  @ApiProperty({
    description: 'Data da última compra realizada pelo cliente.',
    example: '2023-10-27T14:30:00.000Z',
    required: false,
    nullable: true,
  })
  ultimaCompra: Date | null; // Ajustado para refletir que pode ser Date ou null.

  // @ApiProperty() documenta o valor da última compra do cliente.
  // Pode ser nulo se o cliente nunca comprou.
  @ApiProperty({
    description: 'Valor da última compra realizada pelo cliente.',
    type: 'number',
    format: 'double',
    example: 150.75,
    required: false,
    nullable: true,
  })
  valorUltimaCompra: Decimal | null; // Ajustado para refletir que pode ser Decimal ou null.

  // @ApiProperty() documenta se o cliente está negativado.
  @ApiProperty({
    description:
      'Indica se o cliente possui restrições de crédito (negativado).',
    example: false,
  })
  negativado: boolean;

  // @ApiProperty() documenta se o cliente está bloqueado para novas compras ou operações.
  @ApiProperty({
    description: 'Indica se o cliente está bloqueado no sistema.',
    example: false,
  })
  bloqueado: boolean;

  // @ApiProperty() documenta a data e hora em que o registro do cliente foi criado.
  @ApiProperty({
    description: 'Data e hora de criação do registro do cliente.',
    example: '2023-01-15T09:00:00.000Z',
  })
  criadoEm: Date;

  // @ApiProperty() documenta a data e hora da última atualização do registro do cliente.
  @ApiProperty({
    description: 'Data e hora da última atualização do registro do cliente.',
    example: '2023-10-28T11:45:00.000Z',
  })
  atualizadoEm: Date;
}
