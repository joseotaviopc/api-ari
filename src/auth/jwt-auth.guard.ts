//src/auth/jwt-auth.guard.ts
// Importa o decorador Injectable do NestJS.
// Injectable marca uma classe como um provedor que pode ser gerenciado pelo contêiner de Injeção de Dependência (DI) do NestJS.
import { Injectable } from '@nestjs/common';
// Importa a classe AuthGuard do módulo @nestjs/passport.
// AuthGuard é uma classe base fornecida pelo Passport para implementar guardas de autenticação.
import { AuthGuard } from '@nestjs/passport';

// O decorador @Injectable() marca a classe JwtAuthGuard como um provedor.
// Isso permite que o NestJS gerencie sua instância e a injete onde for necessário,
// como em decoradores de rota (ex: @UseGuards(JwtAuthGuard)).
@Injectable()
// A classe JwtAuthGuard estende AuthGuard.
// Ao passar 'jwt' como argumento para AuthGuard('jwt'), estamos especificando que este guarda
// deve usar a estratégia de autenticação JWT que foi registrada com o nome 'jwt'.
// Essa estratégia é tipicamente definida em um arquivo como 'jwt.strategy.ts'.
// O guarda irá automaticamente invocar a lógica da JwtStrategy (o método validate)
// para autenticar o usuário com base no token JWT presente na requisição.
export class JwtAuthGuard extends AuthGuard('jwt') {}
