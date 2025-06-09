// Importa o script de instrumentação do Sentry.
// Este script normalmente inicializa o Sentry para monitoramento de erros e performance.
import './instrument';

// Importações de módulos e classes do NestJS e outras bibliotecas.
import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module'; // Módulo raiz da aplicação.
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Para documentação da API (Swagger/OpenAPI).
import {
  ConsoleLogger, // Logger padrão do NestJS para o console.
  ClassSerializerInterceptor, // Interceptor para serializar dados de resposta (ex: remover campos sensíveis).
  ValidationPipe, // Pipe para validar dados de entrada das requisições.
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser'; // Middleware para parsear cookies.
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter'; // Filtro para tratar exceções do Prisma.
// import { PrismaService } from 'nestjs-prisma'; // Serviço do Prisma para interagir com o banco de dados.

// Função assíncrona principal que inicializa e configura a aplicação NestJS.
async function bootstrap() {
  // Cria uma instância da aplicação NestJS.
  // AppModule é o módulo raiz que define a estrutura da aplicação.
  const app = await NestFactory.create(AppModule, {
    // Configura um logger customizado para o console com um prefixo "ARI".
    logger: new ConsoleLogger({
      prefix: 'ARI', // O prefixo padrão é "Nest".
    }),
    // Configuração do CORS (Cross-Origin Resource Sharing).
    cors: {
      origin: '*', // Permite requisições de qualquer origem. Em produção, é recomendado restringir para domínios específicos.
      // Exemplo de configuração mais restritiva para origens específicas:
      // [
      //   process.env.FRONTEND_URL || 'http://localhost:3001',
      //   'http://localhost:5173',
      //   'http://localhost:5174',
      //   'https://ari-web.vercel.app/',
      // ],
      // credentials: true, // Se true, permite o envio de cookies e cabeçalhos de autorização em requisições cross-origin.
    },
  });

  // Obtém a instância do PrismaService para configurar o log de queries.
  // const prismaService: PrismaService = app.get(PrismaService);
  // Registra um listener para o evento 'query' do Prisma.
  // Isso loga todas as queries executadas pelo Prisma no console. Útil para debugging.
  // prismaService.$on('query', (event) => {
  //   console.log(event);
  // });

  // Adiciona o middleware cookie-parser para habilitar o parsing de cookies das requisições.
  app.use(cookieParser());

  // Configura pipes globais. Estes serão aplicados a todas as rotas da aplicação.
  // ValidationPipe: Valida automaticamente os DTOs (Data Transfer Objects) das requisições.
  // whitelist: true remove quaisquer propriedades que não estejam definidas no DTO.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // ClassSerializerInterceptor: Utilizado para transformar objetos de plain JavaScript em instâncias de classes
  // e vice-versa, permitindo o uso de decoradores como @Exclude() e @Expose() em DTOs/entidades.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configura filtros globais de exceção.
  // PrismaClientExceptionFilter: Captura e formata exceções específicas lançadas pelo Prisma Client.
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Configuração do Swagger para documentação da API.
  const config = new DocumentBuilder()
    .setTitle('ARI') // Título da API.
    .setDescription('The ARI API description') // Descrição da API.
    .setVersion('1.0') // Versão da API.
    .addTag('ARI') // Adiciona uma tag para agrupar endpoints.
    .addBearerAuth() // Adiciona suporte para autenticação Bearer (JWT) na UI do Swagger.
    .build(); // Constrói o objeto de configuração.

  // Cria o documento Swagger com base na aplicação e na configuração.
  const document = SwaggerModule.createDocument(app, config);
  // Configura o endpoint '/api' para servir a UI do Swagger e a especificação OpenAPI.
  SwaggerModule.setup('api', app, document);

  // Define a porta em que a aplicação irá rodar.
  // Utiliza a variável de ambiente PORT, ou 3000 como padrão.
  const port = process.env.PORT || 3000;
  // Inicia o servidor HTTP e o faz escutar na porta definida.
  await app.listen(port);
  // Loga mensagens no console indicando que a aplicação está rodando e onde acessar o Swagger.
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger is running on: http://localhost:${port}/api`);
}

// Chama a função bootstrap para iniciar a aplicação.
// Adiciona um tratamento de erro para o caso de falhas durante a inicialização.
bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Error during application startup:', error.message);
  } else {
    console.error('An unknown error occurred during application startup');
  }
  // Encerra o processo com código de erro 1 em caso de falha na inicialização.
  process.exit(1);
});
