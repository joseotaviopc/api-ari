// src/users/users.service.ts

// Importa o decorador Injectable para marcar a classe como um provedor de serviços
// e Logger para registrar mensagens e eventos da aplicação.
import { Injectable, Logger } from '@nestjs/common';
// Importa o CreateUserDto, que define a estrutura dos dados para criar um novo usuário.
import { CreateUserDto } from './dto/create-user.dto';
// Importa o UpdateUserDto, que define a estrutura dos dados para atualizar um usuário existente.
// import { UpdateUserDto } from './dto/update-user.dto';
// Importa o PrismaService da biblioteca nestjs-prisma para interagir com o banco de dados através do Prisma ORM.
import { PrismaService } from 'nestjs-prisma';
// Importa a biblioteca bcrypt para hashing de senhas, uma prática de segurança essencial.
import * as bcrypt from 'bcrypt';

// Define o número de "rounds" (iterações) para o algoritmo de hashing bcrypt.
// Um número maior de rounds torna o hash mais seguro contra ataques de força bruta,
// mas também aumenta o tempo de processamento para gerar o hash.
export const roundsOfHashing = 10;

// O decorador @Injectable() marca a classe UsersService como um provedor.
// Isso permite que o NestJS gerencie sua instância e a injete em outros componentes (ex: UsersController).
@Injectable()
export class UsersService {
  // Cria uma instância privada e somente leitura do Logger.
  // O nome 'UsersService.name' (que é 'UsersService') é usado como o contexto do logger,
  // ajudando a identificar a origem das mensagens de log.
  private readonly logger = new Logger(UsersService.name);

  // O construtor injeta uma instância de PrismaService.
  // Esta dependência é resolvida pelo contêiner de Injeção de Dependência (DI) do NestJS.
  // O PrismaService será usado para todas as interações com o banco de dados relacionadas a usuários.
  constructor(private prisma: PrismaService) {}

  // Método assíncrono para criar um novo usuário.
  // Recebe um createUserDto com os dados do usuário.
  async create(createUserDto: CreateUserDto) {
    // Loga o início da operação de criação de usuário.
    this.logger.log('Creating user');

    // Gera o hash da senha fornecida usando bcrypt.
    // A senha original em createUserDto é substituída pelo hash.
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing, // Utiliza a constante definida para o número de rounds.
    );

    // Cria um novo objeto de dados para o Prisma para evitar a mutação do DTO de entrada.
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      id_base: 1,
      iduser: Math.floor(Math.random() * 1_000_000),
      name: createUserDto.name || 'nome',
    };

    // Utiliza o Prisma Client para criar um novo registro de usuário no banco de dados.
    // Os dados para criação são passados através do createUserDto.
    const userCreated = await this.prisma.ari_users.create({ data: userData });

    return userCreated;
  }

  // // Método assíncrono para buscar todos os usuários.
  async findAll() {
    // Loga a operação de busca de todos os usuários.
    this.logger.log('Finding all users');
    // Utiliza o Prisma Client para buscar todos os registros da tabela de usuários.
    return await this.prisma.ari_users.findMany();
  }

  // // Método assíncrono para buscar um usuário específico pelo seu ID.
  // // Recebe o ID do usuário como um número.
  async findOne(id: number) {
    // Loga a operação de busca de usuário pelo ID.
    this.logger.log(`Finding user with ID: ${id}`);
    // Utiliza o Prisma Client para buscar um usuário único onde o ID corresponde ao fornecido.
    // Retorna o usuário encontrado ou null se nenhum usuário com esse ID existir.
    return await this.prisma.ari_users.findUnique({ where: { id } });
  }

  // // Método assíncrono para buscar um usuário específico pelo seu e-mail.
  // // Recebe o e-mail do usuário como uma string.
  async findByEmail(email: string) {
    // Loga a operação de busca de usuário pelo e-mail.
    this.logger.log(`Finding user with email: ${email}`);
    // Utiliza o Prisma Client para buscar um usuário único onde o e-mail corresponde ao fornecido.
    // Retorna o usuário encontrado ou null se nenhum usuário com esse e-mail existir.
    return await this.prisma.ari_users.findUnique({ where: { email } });
  }

  // // Método assíncrono para atualizar os dados de um usuário existente.
  // // Recebe o ID do usuário a ser atualizado e um updateUserDto com os novos dados.
  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   // Loga o início da operação de atualização de usuário.
  //   this.logger.log(`Updating user with ID: ${id}`);

  //   // Cria uma cópia do DTO para evitar mutação do objeto original.
  //   // Especifique o tipo para dataToUpdate para incluir a propriedade password opcional.
  //   const dataToUpdate: Partial<UpdateUserDto> & { password?: string } = {
  //     ...updateUserDto,
  //   };

  //   // Verifica se uma nova senha foi fornecida no DTO de atualização.
  //   if (updateUserDto.password) {
  //     // Se uma nova senha foi fornecida, gera o hash dela antes de salvar.
  //     dataToUpdate.password = await bcrypt.hash(
  //       updateUserDto.password,
  //       roundsOfHashing,
  //     );
  //   }
  //   // Utiliza o Prisma Client para atualizar o registro do usuário no banco de dados.
  //   // 'where: { id }' especifica qual usuário atualizar.
  //   // 'data: dataToUpdate' fornece os novos dados.
  //   // O Prisma lançará uma exceção (ex: PrismaClientKnownRequestError com código P2025)
  //   // se nenhum usuário com o ID fornecido for encontrado.
  //   return await this.prisma.user.update({ where: { id }, data: dataToUpdate });
  // }

  // // Método assíncrono para remover um usuário do banco de dados.
  // // Recebe o ID do usuário a ser removido.
  // async remove(id: number) {
  //   // Loga a operação de remoção de usuário.
  //   this.logger.log(`Removing user with ID: ${id}`);
  //   // Utiliza o Prisma Client para deletar o registro do usuário.
  //   // 'where: { id }' especifica qual usuário deletar.
  //   // O Prisma lançará uma exceção se o usuário não for encontrado.
  //   return await this.prisma.user.delete({ where: { id } });
  // }
}
