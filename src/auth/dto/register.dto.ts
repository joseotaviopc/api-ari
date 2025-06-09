//src/auth/dto/login.dto.ts
// Importa o decorador ApiProperty do Swagger para documentar as propriedades do DTO na API.
import { ApiProperty } from '@nestjs/swagger';
// Importa decoradores de validação da biblioteca class-validator.
// IsEmail: Verifica se a string é um formato de e-mail válido.
// IsNotEmpty: Verifica se a propriedade não está vazia (null, undefined, string vazia).
// IsString: Verifica se a propriedade é uma string.
// MinLength: Verifica se a string tem um comprimento mínimo.
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Define a classe LoginDto (Data Transfer Object).
// Esta classe é usada para definir a estrutura e as regras de validação
// para os dados de entrada da requisição de login.
// O ValidationPipe global (configurado no main.ts) usará os decoradores
// do class-validator para validar automaticamente o corpo da requisição.
export class RegisterDto {
  // O decorador @IsEmail() garante que o valor fornecido para 'email' seja um e-mail válido.
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' }) // Mensagem de erro customizada para falha na validação de e-mail.
  // O decorador @IsNotEmpty() garante que o campo 'email' não seja enviado vazio.
  @IsNotEmpty({ message: 'O campo e-mail não pode estar vazio.' }) // Mensagem de erro customizada.
  // O decorador @ApiProperty() informa ao Swagger para incluir esta propriedade na documentação da API,
  // permitindo que os desenvolvedores vejam o formato esperado para o e-mail.
  @ApiProperty({
    description: 'O endereço de e-mail do usuário para login.',
    example: 'usuario@exemplo.com',
  })
  // Declara a propriedade 'email' do tipo string.
  email: string;

  // O decorador @IsString() garante que o valor fornecido para 'password' seja uma string.
  @IsString({ message: 'A senha deve ser uma string.' }) // Mensagem de erro customizada.
  // O decorador @IsNotEmpty() garante que o campo 'password' não seja enviado vazio.
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' }) // Mensagem de erro customizada.
  // O decorador @MinLength(6) garante que a senha tenha no mínimo 6 caracteres.
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }) // Mensagem de erro customizada.
  // O decorador @ApiProperty() informa ao Swagger para incluir esta propriedade na documentação da API.
  @ApiProperty({
    description: 'A senha do usuário para login (mínimo de 6 caracteres).',
    example: 'senha123',
    minLength: 6,
  })
  // Declara a propriedade 'password' do tipo string.
  password: string;

  @IsString({ message: 'O nome deve ser uma string.' }) // Mensagem de erro customizada.
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' }) // Mensagem de erro customizada.
  @ApiProperty({
    description: 'O nome do usuário para login.',
    example: 'Usuario Exemplo',
  })
  name: string;
}
