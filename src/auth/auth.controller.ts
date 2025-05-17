//src/auth/auth.controller.ts

// Importa os decoradores Body, Controller e Post do NestJS.
// Body: Extrai o corpo da requisição.
// Controller: Define a classe como um controlador, agrupando rotas relacionadas.
// Post: Define um método como um manipulador de requisições HTTP POST.
import { Body, Controller, Post } from '@nestjs/common';
// Importa o AuthService, que contém a lógica de negócios para autenticação.
import { AuthService } from './auth.service';
// Importa decoradores do Swagger para documentação da API.
// ApiNotFoundResponse: Documenta uma resposta 404 (Não Encontrado).
// ApiOkResponse: Documenta uma resposta 200 (OK).
// ApiTags: Agrupa endpoints na documentação do Swagger.
// ApiUnauthorizedResponse: Documenta uma resposta 401 (Não Autorizado).
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// Importa a entidade AuthEntity, que define a estrutura da resposta de autenticação (ex: token de acesso).
import { AuthEntity } from './entity/auth.entity';
// Importa o LoginDto (Data Transfer Object), que define a estrutura dos dados esperados no corpo da requisição de login.
import { LoginDto } from './dto/login.dto';

// O decorador @Controller('auth') define que este controlador manipulará requisições para o caminho base '/auth'.
// Ex: /auth/login
@Controller('auth')
// O decorador @ApiTags('Auth') agrupa os endpoints deste controlador sob a tag 'Auth' na documentação do Swagger.
@ApiTags('Auth')
export class AuthController {
  // O construtor injeta uma instância de AuthService.
  // O modificador 'private readonly' cria e inicializa o membro authService na mesma linha.
  // Este serviço será usado para processar a lógica de login.
  constructor(private readonly authService: AuthService) {}

  // O decorador @Post('login') define que este método manipulará requisições HTTP POST para o caminho '/auth/login'.
  @Post('login')
  // @ApiOkResponse({ type: AuthEntity }) documenta que uma resposta bem-sucedida (200 OK) retornará um objeto do tipo AuthEntity.
  @ApiOkResponse({ type: AuthEntity })
  // @ApiUnauthorizedResponse() documenta que uma resposta 401 (Não Autorizado) pode ser retornada (ex: senha inválida).
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  // @ApiNotFoundResponse() documenta que uma resposta 404 (Não Encontrado) pode ser retornada (ex: usuário não encontrado).
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  // O método login recebe o corpo da requisição, que é validado e tipado pelo LoginDto.
  // O decorador @Body() extrai o corpo da requisição.
  // A desestruturação { email, password } extrai as propriedades do DTO.
  login(@Body() { email, password }: LoginDto) {
    // Chama o método login do AuthService, passando o email e a senha.
    // Retorna o resultado da operação de login (geralmente um token de acesso).
    return this.authService.login(email, password);
  }
}
