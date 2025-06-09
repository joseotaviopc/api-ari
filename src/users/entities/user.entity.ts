// src/users/entities/user.entity.ts
// Importa o decorador ApiProperty do Swagger para documentar as propriedades da entidade na API.
import { ApiProperty } from '@nestjs/swagger';
// Importa o tipo User do Prisma Client. Este tipo representa a estrutura de um usuário no banco de dados.
// import { User } from '@prisma/client';
// Importa o decorador Exclude da biblioteca class-transformer.
// Este decorador é usado para omitir propriedades ao transformar a classe em um objeto JSON (ex: em respostas de API).
import { Exclude } from 'class-transformer';

// Define a classe UserEntity.
// Esta classe implementa a interface User do Prisma, garantindo que ela tenha todas as propriedades de um usuário do banco de dados.
// UserEntity é usada para representar usuários nas respostas da API, permitindo controle sobre quais dados são expostos.
export class UserEntity {
  // O construtor permite criar uma instância de UserEntity a partir de um objeto parcial.
  // Object.assign(this, partial) copia as propriedades do objeto 'partial' para a nova instância de UserEntity.
  // Isso é útil para converter objetos de usuário do Prisma (ou DTOs) em instâncias de UserEntity.
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  // O decorador @ApiProperty() informa ao Swagger para incluir esta propriedade na documentação da API.
  // Define a propriedade 'id' do tipo número, que é o identificador único do usuário.
  @ApiProperty({ description: 'O ID único do usuário.', example: 1 })
  id: number;

  // @ApiProperty() documenta a data de criação do usuário.
  @ApiProperty({
    description: 'A data e hora em que o usuário foi criado.',
    example: '2023-10-27T10:00:00.000Z',
  })
  createdAt: Date;

  // @ApiProperty() documenta a data da última atualização do usuário.
  @ApiProperty({
    description: 'A data e hora da última atualização do usuário.',
    example: '2023-10-27T10:30:00.000Z',
  })
  updatedAt: Date;

  // @ApiProperty() documenta o nome de usuário.
  @ApiProperty({
    description: 'O nome de usuário (login).',
    example: 'joao_silva',
  })
  username: string;

  // @ApiProperty() documenta o endereço de e-mail do usuário.
  @ApiProperty({
    description: 'O endereço de e-mail do usuário.',
    example: 'joao.silva@example.com',
  })
  email: string;

  // @ApiProperty() documenta o status de ativação do usuário.
  @ApiProperty({
    description: 'Indica se o usuário está ativo ou não.',
    example: true,
  })
  isActive: boolean;

  // O decorador @Exclude() da biblioteca class-transformer garante que a propriedade 'password'
  // seja omitida quando a instância de UserEntity for serializada para JSON.
  // Isso é uma medida de segurança importante para não expor senhas (mesmo que hasheadas) nas respostas da API.
  // Para que @Exclude() funcione, o ClassSerializerInterceptor deve estar habilitado globalmente (geralmente no main.ts).
  @Exclude()
  password: string;
}
