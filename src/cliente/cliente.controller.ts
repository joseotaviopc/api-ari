// Importa decoradores e classes do NestJS para definir o controlador e manipular requisições HTTP.
import {
  Body,
  Controller,
  Get,
  Logger,
  // Delete,
  // Param,
  // ParseIntPipe, // Importa ParseIntPipe para converter parâmetros de rota para número.
  // Post,
  // Put,
} from '@nestjs/common';
// Importa o ClienteService, que contém a lógica de negócio para clientes.
import { ClienteService } from './cliente.service';
// Importa a ClienteEntity, usada para tipar as respostas da API.
// import { ClienteEntity } from './entity/cliente.entity';
// Importa tipos do Prisma para tipar os DTOs de entrada (Create e Update).
// import { CreateClienteDto } from './dto/create-cliente.dto';
// import { UpdateClienteDto } from './dto/update-cliente.dto';

// O decorador @Controller('cliente') define que este controlador manipulará requisições para o caminho base '/cliente'.
@Controller('cliente')
export class ClienteController {
  private readonly logger = new Logger(ClienteController.name);

  // O construtor injeta uma instância do ClienteService.
  // O NestJS gerencia a criação e injeção dessa dependência.
  constructor(private readonly clienteService: ClienteService) {}

  // O decorador @Post() mapeia este método para requisições POST no caminho base '/cliente'.
  // @Body() extrai o corpo da requisição HTTP e o valida (se ValidationPipe estiver configurado).
  // Prisma.ClienteCreateInput é o tipo esperado para os dados de criação.
  // A função retorna uma Promise que resolve para uma ClienteEntity.
  // @Post()
  // async create(
  //   @Body() createClienteDto: CreateClienteDto,
  // ): Promise<ClienteEntity> {
  //   // Chama o método create do ClienteService com os dados recebidos.
  //   return this.clienteService.create(createClienteDto);
  // }

  // O decorador @Get() mapeia este método para requisições GET no caminho base '/cliente'.
  // A função retorna uma Promise que resolve para um array de ClienteEntity.
  @Get()
  async findAll(): Promise<unknown[]> {
    // Chama o método findAll do ClienteService para buscar todos os clientes.
    this.logger.log('Finding all clientes');
    return this.clienteService.findAll();
  }

  // O decorador @Get(':id') mapeia este método para requisições GET em caminhos como '/cliente/123'.
  // ':id' é um parâmetro de rota.
  // @Param('id') extrai o valor do parâmetro 'id' da URL.
  // ParseIntPipe converte a string do parâmetro 'id' para um número inteiro.
  // A função retorna uma Promise que resolve para uma ClienteEntity ou null se não encontrado.
  // @Get(':id')
  // async findOne(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<ClienteEntity | null> {
  //   // Chama o método findOne do ClienteService com o ID.
  //   return this.clienteService.findOne(id);
  // }

  // O decorador @Put(':id') mapeia este método para requisições PUT em caminhos como '/cliente/123'.
  // @Param('id', ParseIntPipe) extrai e converte o ID.
  // @Body() extrai o corpo da requisição com os dados de atualização.
  // Prisma.ClienteUpdateInput é o tipo esperado para os dados de atualização.
  // A função retorna uma Promise que resolve para a ClienteEntity atualizada.
  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateClienteDto: UpdateClienteDto,
  // ): Promise<ClienteEntity> {
  //   // Chama o método update do ClienteService com o ID e os dados.
  //   return this.clienteService.update(id, updateClienteDto);
  // }

  // O decorador @Delete(':id') mapeia este método para requisições DELETE em caminhos como '/cliente/123'.
  // @Param('id', ParseIntPipe) extrai e converte o ID.
  // A função retorna uma Promise que resolve para void (sem corpo de resposta, geralmente 204 No Content).
  // @Delete(':id')
  // async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
  //   // Chama o método delete do ClienteService com o ID.
  //   return this.clienteService.delete(id);
  // }
}
