// src/cliente/dto/update-cliente.dto.ts

// Importa a função PartialType do Swagger.
// PartialType é uma função utilitária que cria um novo tipo (classe DTO)
// onde todas as propriedades do tipo base são opcionais.
// Isso é útil para DTOs de atualização, onde o cliente pode enviar apenas os campos que deseja modificar.
import { PartialType } from '@nestjs/swagger';
// Importa o CreateClienteDto.
// O UpdateClienteDto herdará as propriedades e validações do CreateClienteDto,
// mas com a diferença de que todas as propriedades serão opcionais.
import { CreateClienteDto } from './create-cliente.dto';

// Define a classe UpdateClienteDto.
// Esta classe estende PartialType(CreateClienteDto).
// Isso significa que UpdateClienteDto terá todas as propriedades de CreateClienteDto
// (idPessoa, idVendedor, limiteCredito, ativo, observacao, score, ultimaCompra, valorUltimaCompra, negativado, bloqueado),
// mas cada uma delas será marcada como opcional.
// Os decoradores de validação (como @IsNumber, @IsBoolean, @IsOptional, etc.) definidos em CreateClienteDto
// ainda serão aplicados se o campo correspondente for fornecido na requisição de atualização.
// O Swagger também entenderá que essas propriedades são opcionais na documentação da API.
export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
