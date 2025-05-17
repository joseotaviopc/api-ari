// src/users/users.module.ts
// Importa o decorador Module do NestJS, usado para organizar a aplicação em módulos.
import { Module } from '@nestjs/common';
// Importa o UsersService, que contém a lógica de negócios para a gestão de usuários.
import { UsersService } from './users.service';
// Importa o UsersController, que lida com as requisições HTTP relacionadas a usuários.
import { UsersController } from './users.controller';

// O decorador @Module define a classe UsersModule como um módulo NestJS.
// Este módulo agrupa todos os componentes relacionados à funcionalidade de usuários.
@Module({
  // A propriedade 'controllers' lista os controladores que pertencem a este módulo.
  // O UsersController será responsável por mapear as rotas HTTP para os métodos do UsersService.
  controllers: [UsersController],
  // A propriedade 'providers' lista os serviços (providers) que este módulo instancia e gerencia.
  // O UsersService será injetável em outros componentes dentro deste módulo (como o UsersController)
  // ou em outros módulos que importem o UsersModule (se UsersService for exportado).
  providers: [UsersService],
  // A propriedade 'imports' lista outros módulos dos quais este módulo depende.
  // Neste caso, está vazio, o que significa que UsersModule não depende diretamente de
  // serviços exportados por outros módulos para sua funcionalidade básica.
  // No entanto, o PrismaService é usado pelo UsersService. O PrismaModule é configurado como global
  // no AppModule, tornando o PrismaService disponível em toda a aplicação sem necessidade de importação explícita aqui.
  imports: [],
  // A propriedade 'exports' lista os provedores que este módulo torna disponíveis para outros módulos que o importam.
  // Se UsersService precisasse ser usado por outros módulos (ex: AuthModule), ele seria listado aqui.
  // Atualmente, UsersService é usado pelo AuthModule, então ele deveria ser exportado.
  // Exemplo: exports: [UsersService]
})
// Exporta a classe UsersModule para que possa ser importada no módulo raiz (AppModule) ou outros módulos.
export class UsersModule {}
