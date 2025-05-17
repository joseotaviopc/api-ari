// src/users/dto/update-user.dto.ts

// Importa a função PartialType do Swagger.
// PartialType é uma função utilitária que cria um novo tipo (classe DTO)
// onde todas as propriedades do tipo base são opcionais.
// Isso é útil para DTOs de atualização, onde o cliente pode enviar apenas os campos que deseja modificar.
import { PartialType } from '@nestjs/swagger';
// Importa o CreateUserDto.
// O UpdateUserDto herdará as propriedades e validações do CreateUserDto,
// mas com a diferença de que todas as propriedades serão opcionais.
import { CreateUserDto } from './create-user.dto';

// Define a classe UpdateUserDto.
// Esta classe estende PartialType(CreateUserDto).
// Isso significa que UpdateUserDto terá todas as propriedades de CreateUserDto (username, email, password),
// mas cada uma delas será marcada como opcional.
// Os decoradores de validação (como @IsString, @IsNotEmpty, @MinLength) definidos em CreateUserDto
// ainda serão aplicados se o campo correspondente for fornecido na requisição de atualização.
// O Swagger também entenderá que essas propriedades são opcionais na documentação da API.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
