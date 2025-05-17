//src/auth/jwt.strategy.ts
// Importa os decoradores Injectable e UnauthorizedException do NestJS.
// Injectable: Marca a classe como um provedor que pode ser injetado.
// UnauthorizedException: Exceção para ser lançada quando a autenticação falha (HTTP 401).
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Importa PassportStrategy do módulo @nestjs/passport, que é a base para criar estratégias de autenticação.
import { PassportStrategy } from '@nestjs/passport';
// Importa ExtractJwt e Strategy da biblioteca passport-jwt.
// ExtractJwt: Fornece métodos para extrair o JWT da requisição (ex: do cabeçalho Authorization).
// Strategy: A classe base para a estratégia de autenticação JWT.
import { ExtractJwt, Strategy } from 'passport-jwt';
// Importa o UsersService para buscar informações do usuário no banco de dados.
import { UsersService } from 'src/users/users.service';

// O decorador @Injectable() marca a classe JwtStrategy como um provedor.
// Isso permite que o NestJS gerencie sua instância e a injete onde for necessário (ex: no AuthModule).
@Injectable()
// A classe JwtStrategy estende PassportStrategy.
// O primeiro argumento para PassportStrategy é a estratégia do Passport a ser usada (Strategy de passport-jwt).
// O segundo argumento, 'jwt', é um nome opcional para esta estratégia. Se fornecido, o AuthGuard('jwt')
// usará esta estratégia específica.
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // O construtor injeta uma instância de UsersService.
  constructor(private usersService: UsersService) {
    // Chama o construtor da classe pai (PassportStrategy) com as opções de configuração.
    super({
      // Define como o JWT será extraído da requisição.
      // ExtractJwt.fromAuthHeaderAsBearerToken() extrai o token do cabeçalho 'Authorization' como um Bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Define o segredo usado para verificar a assinatura do JWT.
      // Este DEVE ser o mesmo segredo usado para assinar o token no AuthService.
      // O '!' (non-null assertion operator) indica que process.env.JWT_SECRET não será nulo ou indefinido.
      // É crucial garantir que esta variável de ambiente esteja definida.
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Método assíncrono 'validate' que o Passport invoca após verificar a assinatura do JWT e decodificar o JSON.
  // O 'payload' é o objeto decodificado do JWT (o que foi passado para jwtService.sign no AuthService).
  // Este método deve retornar o usuário se a validação for bem-sucedida, ou lançar uma exceção caso contrário.
  // O valor retornado por este método será injetado no objeto 'request.user'.
  async validate(payload: { userId: number }) {
    // Busca o usuário no banco de dados usando o userId extraído do payload do JWT.
    const user = await this.usersService.findOne(payload.userId);

    // Se nenhum usuário for encontrado com o ID do payload, lança uma UnauthorizedException.
    // Isso significa que o token é válido (assinatura correta), mas o usuário associado a ele não existe mais.
    if (!user) {
      throw new UnauthorizedException();
    }

    // Se o usuário for encontrado, ele é retornado.
    // O Passport irá então anexar este objeto 'user' ao objeto 'request' da requisição.
    return user;
  }
}
