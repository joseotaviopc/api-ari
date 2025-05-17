// src/auth/entity/auth.entity.ts
// Importa o decorador ApiProperty do Swagger para documentar as propriedades da entidade na API.
import { ApiProperty } from '@nestjs/swagger';

// Define a classe AuthEntity, que representa a estrutura da resposta de uma autenticação bem-sucedida.
// Esta entidade é usada principalmente para tipagem e para a documentação automática da API via Swagger.
export class AuthEntity {
  // O decorador @ApiProperty() informa ao Swagger para incluir esta propriedade na documentação da API.
  // Ele pode receber opções para descrever melhor a propriedade (ex: descrição, exemplo, tipo).
  @ApiProperty({
    description: 'O token de acesso JWT gerado após o login bem-sucedido.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNjQ0NjYxNywiZXhwIjoxNjE2NDUwMjE3fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  // Declara a propriedade accessToken, que armazenará o JSON Web Token.
  accessToken: string;
}
