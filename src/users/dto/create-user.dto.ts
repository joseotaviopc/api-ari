// src/users/dto/create-user.dto.ts

// Importa o decorador ApiProperty do Swagger para documentar as propriedades do DTO na API.
import { ApiProperty } from '@nestjs/swagger';
// Importa decoradores de validação da biblioteca class-validator.
// IsNotEmpty: Verifica se a propriedade não está vazia (null, undefined, string vazia).
// IsString: Verifica se a propriedade é uma string.
// MinLength: Verifica se a string tem um comprimento mínimo.
// IsEmail: (Não usado aqui, mas comum em DTOs de usuário) Verifica se a string é um formato de e-mail válido.
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'; // Adicionado IsEmail para referência, embora não usado diretamente nas propriedades atuais.

// Define a classe CreateUserDto (Data Transfer Object).
// Esta classe é usada para definir a estrutura e as regras de validação
// para os dados de entrada da requisição de criação de um novo usuário.
// O ValidationPipe global (configurado no main.ts) usará os decoradores
// do class-validator para validar automaticamente o corpo da requisição.
export class CreateUserDto {
  // O decorador @IsString() garante que o valor fornecido para 'username' seja uma string.
  @IsString({ message: 'O nome de usuário deve ser uma string.' })
  // O decorador @IsNotEmpty() garante que o campo 'username' não seja enviado vazio.
  @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio.' })
  // O decorador @ApiProperty() informa ao Swagger para incluir esta propriedade na documentação da API,
  // permitindo que os desenvolvedores vejam o formato esperado para o nome de usuário.
  @ApiProperty({
    description: 'O nome de usuário único para login.',
    example: 'joao_silva',
  })
  // Declara a propriedade 'username' do tipo string.
  name: string;

  // O decorador @IsString() garante que o valor fornecido para 'email' seja uma string.
  // Para uma validação mais robusta de e-mail, @IsEmail() seria mais apropriado.
  @IsString({ message: 'O e-mail deve ser uma string.' }) // Poderia ser @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  // O decorador @IsNotEmpty() garante que o campo 'email' não seja enviado vazio.
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  // O decorador @ApiProperty() documenta a propriedade 'email'.
  // O decorador @IsEmail() garante que o valor fornecido para 'email' seja um e-mail válido.
  @IsEmail()
  @ApiProperty({
    description: 'O endereço de e-mail do usuário.',
    example: 'joao.silva@example.com',
    // format: 'email', // Adicionar format: 'email' pode ajudar o Swagger a indicar o tipo esperado.
  })
  // Declara a propriedade 'email' do tipo string.
  email: string;

  // O decorador @IsString() garante que o valor fornecido para 'password' seja uma string.
  @IsString({ message: 'A senha deve ser uma string.' })
  // O decorador @IsNotEmpty() garante que o campo 'password' não seja enviado vazio.
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  // O decorador @MinLength(6) garante que a senha tenha no mínimo 6 caracteres.
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  // O decorador @ApiProperty() documenta a propriedade 'password'.
  @ApiProperty({
    description: 'A senha para o usuário (mínimo de 6 caracteres).',
    example: 'senhaSegura123',
    minLength: 6,
    type: 'string', // Especificar o tipo explicitamente
    format: 'password', // Indica ao Swagger que este campo é uma senha (pode mascarar na UI)
  })
  // Declara a propriedade 'password' do tipo string.
  password: string;
}
