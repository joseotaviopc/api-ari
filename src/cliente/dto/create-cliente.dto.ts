// src/cliente/dto/create-cliente.dto.ts

// Importa o decorador ApiProperty do Swagger para documentar as propriedades do DTO na API.
import { ApiProperty } from '@nestjs/swagger';
// Importa decoradores de validação da biblioteca class-validator.
// IsNotEmpty: Verifica se a propriedade não está vazia.
// IsNumber: Verifica se a propriedade é um número.
// IsBoolean: Verifica se a propriedade é um booleano.
// IsString: Verifica se a propriedade é uma string.
// IsDateString: Verifica se a propriedade é uma string que representa uma data válida.
// IsOptional: Marca a propriedade como opcional na validação.
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
// import { Prisma } from '@prisma/client';

// Define a classe CreateClienteDto (Data Transfer Object).
// Esta classe é usada para definir a estrutura e as regras de validação
// para os dados de entrada da requisição de criação de um novo cliente.
// O ValidationPipe global (configurado no main.ts) usará os decoradores
// do class-validator para validar automaticamente o corpo da requisição.
export class CreateClienteDto {
  // O decorador @IsNumber() garante que o valor fornecido para 'idPessoa' seja um número.
  @IsNumber({}, { message: 'O ID da pessoa deve ser um número válido.' })
  // O decorador @IsNotEmpty() garante que o campo 'idPessoa' não seja enviado vazio.
  @IsNotEmpty({ message: 'O ID da pessoa é obrigatório.' })
  // O decorador @ApiProperty() documenta a propriedade 'idPessoa' no Swagger.
  @ApiProperty({
    description: 'O ID da pessoa física ou jurídica associada ao cliente.',
    example: 101,
  })
  // Declara a propriedade 'idPessoa' do tipo número.
  idPessoa: number;

  // O decorador @IsNumber() garante que o valor fornecido para 'idVendedor' seja um número.
  @IsNumber({}, { message: 'O ID do vendedor deve ser um número válido.' })
  // O decorador @IsOptional() marca esta propriedade como opcional.
  // Se o campo for enviado, ele deve ser um número válido. Se não for enviado, a validação passa.
  @IsOptional()
  // O decorador @ApiProperty() documenta a propriedade 'idVendedor' no Swagger.
  @ApiProperty({
    description: 'O ID do vendedor responsável por este cliente (opcional).',
    example: 201,
    required: false,
    nullable: true,
  })
  // Declara a propriedade 'idVendedor' do tipo número ou nulo.
  idVendedor: number | null;

  // O decorador @IsNumber() garante que o valor fornecido para 'limiteCredito' seja um número.
  // Nota: Embora o tipo final seja Decimal, a validação inicial pode ser feita como número.
  @IsNumber({}, { message: 'O limite de crédito deve ser um número válido.' })
  // O decorador @IsNotEmpty() garante que o campo 'limiteCredito' não seja enviado vazio.
  @IsNotEmpty({ message: 'O limite de crédito é obrigatório.' })
  // O decorador @ApiProperty() documenta a propriedade 'limiteCredito' no Swagger.
  @ApiProperty({
    description: 'O limite de crédito concedido ao cliente.',
    type: 'number', // Documentado como número no Swagger
    format: 'double',
    example: 1000.5,
  })
  // Declara a propriedade 'limiteCredito' do tipo número.
  // A conversão para Decimal do Prisma ocorrerá no serviço/repositório.
  // limiteCredito: Prisma.Decimal; // Usamos number aqui para validação, será convertido para Decimal.

  // O decorador @IsBoolean() garante que o valor fornecido para 'ativo' seja um booleano.
  @IsBoolean({ message: 'O status ativo deve ser um valor booleano.' })
  // O decorador @IsNotEmpty() garante que o campo 'ativo' não seja enviado vazio.
  // Para booleanos, @IsBoolean() geralmente é suficiente, mas @IsNotEmpty() garante que o campo esteja presente.
  @IsNotEmpty({ message: 'O status ativo é obrigatório.' })
  // O decorador @ApiProperty() documenta a propriedade 'ativo' no Swagger.
  @ApiProperty({
    description: 'Indica se o cliente está ativo no sistema.',
    example: true,
  })
  // Declara a propriedade 'ativo' do tipo booleano.
  ativo: boolean;

  // O decorador @IsString() garante que o valor fornecido para 'observacao' seja uma string.
  @IsString({ message: 'A observação deve ser uma string.' })
  // O decorador @IsOptional() marca esta propriedade como opcional.
  @IsOptional()
  // O decorador @ApiProperty() documenta a propriedade 'observacao' no Swagger.
  @ApiProperty({
    description: 'Observações gerais sobre o cliente (opcional).',
    example: 'Cliente prefere contato por e-mail.',
    required: false,
    nullable: true,
  })
  // Declara a propriedade 'observacao' do tipo string ou nulo.
  observacao: string | null;

  // O decorador @IsNumber() garante que o valor fornecido para 'score' seja um número.
  @IsNumber({}, { message: 'O score deve ser um número válido.' })
  // O decorador @IsOptional() marca esta propriedade como opcional.
  @IsOptional()
  // O decorador @ApiProperty() documenta a propriedade 'score' no Swagger.
  @ApiProperty({
    description: 'Score de crédito ou pontuação do cliente (opcional).',
    example: 750,
    required: false,
    nullable: true,
  })
  // Declara a propriedade 'score' do tipo número ou nulo.
  score: number | null;

  // O decorador @IsDateString() garante que o valor fornecido para 'ultimaCompra' seja uma string de data válida.
  @IsDateString(
    {},
    { message: 'A data da última compra deve ser uma data válida.' },
  )
  // O decorador @IsOptional() marca esta propriedade como opcional.
  @IsOptional()
  // O decorador @ApiProperty() documenta a propriedade 'ultimaCompra' no Swagger.
  @ApiProperty({
    description: 'Data da última compra realizada pelo cliente (opcional).',
    example: '2023-10-27T14:30:00.000Z',
    required: false,
    nullable: true,
  })
  // Declara a propriedade 'ultimaCompra' do tipo string ou nulo.
  // Será convertida para Date no serviço/repositório ou pelo Prisma.
  ultimaCompra: Date | null; // Usamos string aqui para validação de formato de data.

  // O decorador @IsNumber() garante que o valor fornecido para 'valorUltimaCompra' seja um número.
  @IsNumber(
    {},
    { message: 'O valor da última compra deve ser um número válido.' },
  )
  // O decorador @IsOptional() marca esta propriedade como opcional.
  @IsOptional()
  // O decorador @ApiProperty() documenta a propriedade 'valorUltimaCompra' no Swagger.
  @ApiProperty({
    description: 'Valor da última compra realizada pelo cliente (opcional).',
    type: 'number',
    format: 'double',
    example: 150.75,
    required: false,
    nullable: true,
  })
  // Declara a propriedade 'valorUltimaCompra' do tipo número ou nulo.
  // Será convertido para Decimal do Prisma no serviço/repositório.
  // valorUltimaCompra: Prisma.Decimal | null; // Usamos number aqui para validação.

  // O decorador @IsBoolean() garante que o valor fornecido para 'negativado' seja um booleano.
  @IsBoolean({ message: 'O status negativado deve ser um valor booleano.' })
  // O decorador @IsNotEmpty() garante que o campo 'negativado' não seja enviado vazio.
  @IsNotEmpty({ message: 'O status negativado é obrigatório.' })
  // O decorador @ApiProperty() documenta a propriedade 'negativado' no Swagger.
  @ApiProperty({
    description:
      'Indica se o cliente possui restrições de crédito (negativado).',
    example: false,
  })
  // Declara a propriedade 'negativado' do tipo booleano.
  negativado: boolean;

  // O decorador @IsBoolean() garante que o valor fornecido para 'bloqueado' seja um booleano.
  @IsBoolean({ message: 'O status bloqueado deve ser um valor booleano.' })
  // O decorador @IsNotEmpty() garante que o campo 'bloqueado' não seja enviado vazio.
  @IsNotEmpty({ message: 'O status bloqueado é obrigatório.' })
  // O decorador @ApiProperty() documenta a propriedade 'bloqueado' no Swagger.
  @ApiProperty({
    description: 'Indica se o cliente está bloqueado no sistema.',
    example: false,
  })
  // Declara a propriedade 'bloqueado' do tipo booleano.
  bloqueado: boolean;

  // Nota: 'criadoEm' e 'atualizadoEm' geralmente são gerenciados pelo banco de dados
  // ou pelo Prisma e não são incluídos no DTO de criação.
}
