//src/auth/auth.module.ts
// Importa o decorador Module do NestJS, usado para organizar a aplicação em módulos.
import { Module } from '@nestjs/common';
// Importa o AuthService, que contém a lógica de negócios para autenticação.
import { AuthService } from './auth.service';
// Importa o AuthController, que lida com as requisições HTTP para autenticação.
import { AuthController } from './auth.controller';
// Importa o PassportModule, que é a base para as estratégias de autenticação no NestJS.
import { PassportModule } from '@nestjs/passport';
// Importa o JwtModule, para trabalhar com JSON Web Tokens (JWT).
import { JwtModule } from '@nestjs/jwt';
// Importa o UsersModule, para ter acesso aos serviços relacionados a usuários (ex: UsersService).
import { UsersModule } from 'src/users/users.module';
// Importa o JwtStrategy, a estratégia de validação de JWT.
import { JwtStrategy } from './jwt.strategy';
// Importa o UsersService, serviço para interagir com os dados dos usuários.
// Nota: Se UsersModule exporta UsersService, esta importação e sua presença em 'providers'
// podem ser redundantes, pois UsersModule já o disponibilizaria.
import { UsersService } from 'src/users/users.service';

// O decorador @Module define a classe AuthModule como um módulo NestJS.
// Este módulo agrupa todos os componentes relacionados à autenticação.
@Module({
  // A propriedade 'imports' lista outros módulos que este módulo depende.
  imports: [
    // Importa o PassportModule para habilitar o uso de estratégias de autenticação.
    PassportModule,
    // Configura e registra o JwtModule.
    JwtModule.register({
      // Define o segredo usado para assinar os JWTs.
      // É crucial que este valor seja mantido seguro e, idealmente, carregado de variáveis de ambiente.
      secret: process.env.JWT_SECRET,
      // Define as opções de assinatura para os JWTs.
      signOptions: {
        // Define o tempo de expiração do token (ex: '60s', '7d', '24h').
        // Este valor também é carregado de variáveis de ambiente.
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    // Importa o UsersModule para que os serviços exportados por ele (como UsersService)
    // estejam disponíveis para injeção neste módulo (AuthModule), especialmente para o JwtStrategy.
    UsersModule,
  ],
  // A propriedade 'controllers' lista os controladores que pertencem a este módulo.
  controllers: [AuthController],
  // A propriedade 'providers' lista os serviços (providers) que pertencem a este módulo.
  // Estes serviços podem ser injetados em controladores ou outros serviços dentro deste módulo.
  providers: [
    AuthService, // Serviço com a lógica de login e geração de token.
    JwtStrategy, // Estratégia para validar os tokens JWT recebidos.
    // UsersService é necessário para o JwtStrategy validar o usuário do token.
    // Se UsersModule já exporta UsersService, ele é disponibilizado através da importação de UsersModule.
    // Listá-lo aqui explicitamente garante sua disponibilidade, mas pode ser redundante.
    UsersService,
  ],
})
// Exporta a classe AuthModule para que possa ser importada no módulo raiz (AppModule) ou outros módulos.
export class AuthModule {}
