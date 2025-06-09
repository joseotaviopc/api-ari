// src/cliente/cliente.module.ts

// Importa o decorador Module do NestJS.
// O decorador @Module() é usado para organizar a aplicação em módulos coesos.
// Um módulo encapsula um conjunto de funcionalidades relacionadas, como controladores, serviços e provedores.
import { Module } from '@nestjs/common';
// Importa o ClienteController.
// Controladores são responsáveis por lidar com as requisições HTTP de entrada e retornar respostas.
import { ClienteController } from './cliente.controller';
// Importa o ClienteService.
// Serviços contêm a lógica de negócios e são injetados em controladores ou outros serviços.
import { ClienteService } from './cliente.service';
// Importa o ClienteRepository.
// Repositórios são responsáveis pela interação com a camada de persistência de dados (banco de dados).
import { ClienteRepository } from './repository/cliente.repository';

// O decorador @Module() define a classe ClienteModule como um módulo do NestJS.
@Module({
  // A propriedade 'controllers' registra os controladores que pertencem a este módulo.
  // O NestJS instanciará e gerenciará o ciclo de vida do ClienteController.
  controllers: [ClienteController],
  // A propriedade 'providers' registra os serviços e outros provedores que pertencem a este módulo.
  // ClienteService e ClienteRepository estarão disponíveis para injeção de dependência
  // dentro deste módulo (por exemplo, ClienteService pode ser injetado em ClienteController,
  // e ClienteRepository pode ser injetado em ClienteService).
  providers: [ClienteService, ClienteRepository],
  // A propriedade 'exports' (não usada aqui) poderia ser usada para tornar provedores deste módulo
  // disponíveis para outros módulos que importarem o ClienteModule.
})
// Define a classe ClienteModule.
// Esta classe agrupa os componentes relacionados à funcionalidade de 'cliente'.
export class ClienteModule {}
