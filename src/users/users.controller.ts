// src/users/users.controller.ts

// Importa decoradores e classes do NestJS para criar o controlador,
// definir rotas HTTP, manipular parâmetros de requisição, e tratar exceções.
import {
  Controller, // Define a classe como um controlador NestJS.
  Get, // Decorador para rotas HTTP GET.
  Post, // Decorador para rotas HTTP POST.
  Body, // Decorador para extrair o corpo da requisição.
  // Patch, // Decorador para rotas HTTP PATCH.
  // Param, // Decorador para extrair parâmetros da rota.
  // Delete, // Decorador para rotas HTTP DELETE.
  // ParseIntPipe, // Pipe para converter um parâmetro de string para número inteiro.
  // NotFoundException, // Exceção para ser lançada quando um recurso não é encontrado (HTTP 404).
  UseGuards,
  HttpException,
  HttpStatus, // Decorador para aplicar guardas de rota.
} from '@nestjs/common';
// Importa o UsersService, que contém a lógica de negócios para usuários.
import { UsersService } from './users.service';
// Importa o CreateUserDto, que define a estrutura dos dados para criar um usuário.
import { CreateUserDto } from './dto/create-user.dto';
// Importa o UpdateUserDto, que define a estrutura dos dados para atualizar um usuário.
// import { UpdateUserDto } from './dto/update-user.dto';
// Importa decoradores do Swagger para documentação da API.
import {
  ApiBadRequestResponse, // Documenta uma resposta 400 (Bad Request).
  ApiBearerAuth, // Documenta que a rota requer autenticação Bearer (JWT).
  ApiConflictResponse, // Documenta uma resposta 409 (Conflict).
  ApiCreatedResponse, // Documenta uma resposta 201 (Created).
  // ApiNotFoundResponse, // Documenta uma resposta 404 (Not Found).
  // ApiOkResponse, // Documenta uma resposta 200 (OK).
  ApiTags, // Agrupa os endpoints na documentação do Swagger.
  // ApiUnauthorizedResponse, // Documenta uma resposta 401 (Unauthorized).
  ApiTooManyRequestsResponse, // Documenta uma resposta 429 (Too Many Requests).
} from '@nestjs/swagger';
// Importa a UserEntity, que define a estrutura da resposta para operações com usuários.
import { UserEntity } from './entities/user.entity';
// Importa o JwtAuthGuard para proteger rotas que requerem autenticação JWT.
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// O decorador @Controller('users') define que este controlador manipulará requisições para o caminho base '/users'.
@Controller('users')
// O decorador @ApiTags('Users') agrupa os endpoints deste controlador sob a tag 'Users' na documentação do Swagger.
@ApiTags('Users')
export class UsersController {
  // O construtor injeta uma instância de UsersService.
  // O modificador 'private readonly' cria e inicializa o membro usersService.
  constructor(private readonly usersService: UsersService) {}

  // Define um manipulador para requisições HTTP POST para '/users'.
  @Post()
  // Documenta que uma resposta 201 (Created) retornará um objeto do tipo UserEntity.
  @ApiCreatedResponse({ type: UserEntity })
  // Documenta possíveis respostas de erro 400 (Bad Request), ex: dados de entrada inválidos.
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' })
  // Documenta possíveis respostas de erro 409 (Conflict), ex: e-mail já existente.
  @ApiConflictResponse({
    description: 'Conflito de dados, ex: e-mail já cadastrado.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Muitas requisições, tente novamente mais tarde.',
  })
  // O método create recebe o corpo da requisição, validado e tipado pelo CreateUserDto.
  async create(@Body() createUserDto: CreateUserDto) {
    // Verifica se já existe um usuário com o mesmo e-mail..
    const hasUser = await this.usersService.findByEmail(createUserDto.email);
    if (hasUser) {
      throw new HttpException(
        'Conflito de dados, ex: e-mail já cadastrado.',
        HttpStatus.CONFLICT,
      );
    }
    // Chama o método create do UsersService e encapsula o resultado em uma UserEntity.
    // A UserEntity é usada para formatar a resposta, possivelmente omitindo campos como a senha.
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  // Define um manipulador para requisições HTTP GET para '/users'.
  @Get()
  // // Aplica o JwtAuthGuard para proteger esta rota, exigindo um token JWT válido.
  @UseGuards(JwtAuthGuard)
  // // Informa ao Swagger que esta rota requer autenticação Bearer.
  @ApiBearerAuth()
  // // Documenta que uma resposta 200 (OK) retornará um array de UserEntity.
  // @ApiOkResponse({ type: UserEntity, isArray: true })
  // // Documenta uma possível resposta 401 (Unauthorized) se o token for inválido ou ausente.
  // @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  // // Documenta uma possível resposta 404 (Not Found) - embora menos comum para findAll, pode ser relevante em alguns contextos.
  // @ApiNotFoundResponse({ description: 'Nenhum usuário encontrado.' }) // Adicionado para consistência, embora findAll geralmente retorne array vazio.
  // @ApiTooManyRequestsResponse({
  //   description: 'Muitas requisições, tente novamente mais tarde.',
  // })
  async findAll() {
    // Chama o método findAll do UsersService.
    const users = await this.usersService.findAll();
    // Mapeia cada usuário retornado para uma instância de UserEntity.
    return users.map((user) => new UserEntity(user));
  }

  // // Define um manipulador para requisições HTTP GET para '/users/:id'.
  // @Get(':id')
  // // Protege a rota com autenticação JWT.
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // // Documenta a resposta 200 (OK) com um UserEntity.
  // @ApiOkResponse({ type: UserEntity })
  // @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  // @ApiNotFoundResponse({
  //   description: 'Usuário não encontrado com o ID fornecido.',
  // })
  // @ApiTooManyRequestsResponse({
  //   description: 'Muitas requisições, tente novamente mais tarde.',
  // })
  // // O método findOne recebe o parâmetro 'id' da rota.
  // // ParseIntPipe converte o 'id' (que vem como string da URL) para um número.
  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   // Chama o método findOne do UsersService.
  //   const user = await this.usersService.findOne(id);

  //   // Se nenhum usuário for encontrado com o ID fornecido, lança uma NotFoundException.
  //   if (!user) {
  //     throw new NotFoundException(`Usuário não encontrado com o ID ${id}`);
  //   }

  //   // Retorna o usuário encontrado, encapsulado em uma UserEntity.
  //   return new UserEntity(user);
  // }

  // // Define um manipulador para requisições HTTP PATCH para '/users/:id'.
  // @Patch(':id')
  // // Protege a rota com autenticação JWT.
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // // Documenta a resposta 200 (OK) ou 201 (Created) com um UserEntity após a atualização.
  // // Nota: PATCH geralmente retorna 200 OK. Se criar um recurso, seria 201.
  // // Usaremos ApiOkResponse para consistência com a atualização.
  // @ApiOkResponse({
  //   type: UserEntity,
  //   description: 'Usuário atualizado com sucesso.',
  // })
  // // @ApiCreatedResponse({ type: UserEntity }) // Alternativa se o PATCH puder criar.
  // @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  // @ApiNotFoundResponse({
  //   description: 'Usuário não encontrado para atualização.',
  // })
  // @ApiTooManyRequestsResponse({
  //   description: 'Muitas requisições, tente novamente mais tarde.',
  // })
  // // O método update recebe o 'id' da rota e o corpo da requisição (UpdateUserDto).
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   // Chama o método update do UsersService.
  //   // O UsersService é responsável por lidar com o caso de usuário não encontrado (pode lançar exceção).
  //   const user = await this.usersService.update(id, updateUserDto);
  //   // Retorna o usuário atualizado, encapsulado em uma UserEntity.
  //   return new UserEntity(user);
  // }

  // // Define um manipulador para requisições HTTP DELETE para '/users/:id'.
  // @Delete(':id')
  // // Protege a rota com autenticação JWT.
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // // Documenta a resposta 200 (OK) com o UserEntity do usuário removido.
  // @ApiOkResponse({
  //   type: UserEntity,
  //   description: 'Usuário removido com sucesso.',
  // })
  // @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  // @ApiNotFoundResponse({ description: 'Usuário não encontrado para remoção.' })
  // @ApiTooManyRequestsResponse({
  //   description: 'Muitas requisições, tente novamente mais tarde.',
  // })
  // // O método remove recebe o 'id' da rota.
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   // Chama o método remove do UsersService.
  //   // O UsersService é responsável por lidar com o caso de usuário não encontrado.
  //   const user = await this.usersService.remove(id);
  //   // Retorna o usuário removido, encapsulado em uma UserEntity.
  //   return new UserEntity(user);
  // }
}
