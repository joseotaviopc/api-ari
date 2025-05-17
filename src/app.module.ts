// Importa o decorador Module do NestJS, usado para organizar a aplicação em módulos.
import { Module } from '@nestjs/common';
// Importa o ConfigModule para gerenciamento de variáveis de ambiente e configurações.
import { ConfigModule } from '@nestjs/config';
// Importa o SentryModule para integração com o Sentry, serviço de monitoramento de erros.
import { SentryModule } from '@sentry/nestjs/setup';
// Importa o AppController, controlador principal da aplicação.
import { AppController } from './app.controller';
// Importa o AppService, serviço principal com a lógica de negócios da aplicação.
import { AppService } from './app.service';
// Importa APP_FILTER, um token para registrar filtros globais de exceção.
import { APP_FILTER } from '@nestjs/core';
// Importa SentryGlobalFilter, um filtro global para capturar exceções e enviá-las ao Sentry.
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
// Importa o AuthModule, módulo responsável pela autenticação.
import { AuthModule } from './auth/auth.module';
// Importa o UsersModule, módulo responsável pela gestão de usuários.
import { UsersModule } from './users/users.module';
// Importa o PrismaModule da biblioteca nestjs-prisma para integração com o Prisma ORM.
import { PrismaModule } from 'nestjs-prisma';
// Importa o ClienteModule, módulo responsável pela gestão de clientes.
// import { ClienteModule } from './cliente/cliente.module';

// O decorador @Module define a classe AppModule como um módulo NestJS.
// Módulos são blocos de construção que ajudam a organizar o código da aplicação.
@Module({
  // A propriedade 'imports' lista outros módulos que este módulo depende.
  // Os serviços e componentes exportados por esses módulos importados ficam disponíveis para este módulo.
  imports: [
    // Configura o ConfigModule para carregar variáveis de ambiente.
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule disponível globalmente em toda a aplicação.
      envFilePath: '.env', // Especifica o caminho para o arquivo .env que contém as variáveis de ambiente.
    }),
    // Configura o SentryModule. A configuração básica é feita aqui,
    // mas a inicialização detalhada (DSN, integrações) geralmente ocorre no arquivo 'instrument.ts'.
    SentryModule.forRoot(),
    // Importa o AuthModule para funcionalidades de autenticação.
    AuthModule,
    // Importa o UsersModule para funcionalidades relacionadas a usuários.
    UsersModule,
    // Configura o PrismaModule para integração com o banco de dados via Prisma.
    PrismaModule.forRoot({
      isGlobal: true, // Torna o PrismaService (e o PrismaClient) disponível globalmente.
      prismaServiceOptions: {
        // Opções específicas para o PrismaService.
        explicitConnect: true, // Requer que o PrismaClient se conecte explicitamente ao banco de dados.
        // Isso pode ser útil para controlar o momento da conexão.
        prismaOptions: {
          // Opções passadas diretamente para o construtor do PrismaClient.
          log: [
            // Configura o logging do Prisma.
            {
              emit: 'event', // Emite eventos de log.
              level: 'error', // Loga apenas eventos de nível 'error'.
            },
            // Outros níveis de log como 'query', 'info', 'warn' podem ser adicionados aqui.
            // Ex: { emit: 'stdout', level: 'query' } para logar queries no console.
          ],
        },
      },
    }),
    // Importa o ClienteModule para funcionalidades relacionadas a clientes.
    // ClienteModule,
  ],
  // A propriedade 'controllers' lista os controladores que pertencem a este módulo.
  // Controladores são responsáveis por lidar com requisições HTTP e retornar respostas.
  controllers: [AppController],
  // A propriedade 'providers' lista os serviços (providers) que pertencem a este módulo.
  // Serviços contêm a lógica de negócios e podem ser injetados em controladores ou outros serviços.
  providers: [
    {
      // Define um provedor global para filtros de exceção.
      provide: APP_FILTER, // Utiliza o token APP_FILTER para registrar o filtro globalmente.
      useClass: SentryGlobalFilter, // Usa SentryGlobalFilter para capturar todas as exceções não tratadas
      // e enviá-las para o Sentry.
    },
    // Registra o AppService como um provedor neste módulo.
    AppService,
  ],
})
// Exporta a classe AppModule para que possa ser importada e usada em outros lugares (ex: main.ts).
export class AppModule {}
