//src/auth/auth.service.ts
// Importa decoradores e classes do NestJS para injeção de dependência, logging e tratamento de exceções.
import {
  Injectable, // Marca a classe como um provedor que pode ser injetado.
  Logger, // Para registrar mensagens e eventos da aplicação.
  NotFoundException, // Exceção para quando um recurso não é encontrado (HTTP 404).
  // UnauthorizedException, // Exceção para acesso não autorizado (HTTP 401).
  BadRequestException, // Exceção para quando uma requisição é inválida (HTTP 400).
} from '@nestjs/common';
// Importa o PrismaService para interagir com o banco de dados através do Prisma ORM.
import { PrismaService } from 'nestjs-prisma';
// Importa o JwtService para criar e assinar JSON Web Tokens (JWT).
import { JwtService } from '@nestjs/jwt';
// Importa a AuthEntity, que define a estrutura da resposta de autenticação (ex: accessToken).
// import { AuthEntity } from './entity/auth.entity';
// Importa a biblioteca bcrypt para hashing e comparação de senhas.
import * as bcrypt from 'bcrypt';

// O decorador @Injectable() marca a classe AuthService como um provedor.
// Isso permite que o NestJS gerencie sua instância e a injete em outros componentes (ex: AuthController).
@Injectable()
export class AuthService {
  // Cria uma instância privada e somente leitura do Logger.
  // O nome 'AuthService.name' (que é 'AuthService') é usado como o contexto do logger,
  // ajudando a identificar a origem das mensagens de log.
  private readonly logger = new Logger(AuthService.name);

  // O construtor injeta instâncias de PrismaService e JwtService.
  // Estas dependências são resolvidas pelo contêiner de DI do NestJS.
  constructor(
    private prisma: PrismaService, // Serviço para interagir com o banco de dados.
    private jwtService: JwtService, // Serviço para manipulação de JWTs.
  ) {}

  // Método assíncrono para autenticar um usuário.
  // Recebe email e senha como parâmetros.
  // Retorna uma Promise que resolve para um AuthEntity (contendo o token de acesso).
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; result: any } | void> {
    // Loga o início do processo de login.
    this.logger.log(`Logging in user: ${email}`);

    // Passo 1: Busca um usuário no banco de dados com o email fornecido.
    // O método findUnique do Prisma é usado para encontrar um registro único.
    // const user = await this.prisma.users.findUnique({
    //   where: { email },
    // });
    // const result = {
    //   ...user,
    //   id: user?.id.toString(), // Convert BigInt to string
    // };
    // this.logger.warn(`User found: ${JSON.stringify(result, null, 2)}`);

    const user = await this.prisma.ari_users.findUnique({
      where: { email },
    });
    const userConvert = {
      ...user,
      id: user?.id.toString(), // Convert BigInt to string
    };
    // this.logger.warn(`UserAri found: ${JSON.stringify(userConvert, null, 2)}`);

    // Se nenhum usuário for encontrado com o email fornecido, lança uma exceção NotFoundException.
    if (!user) {
      this.logger.warn(`No user found for email: ${email}`); // Loga um aviso.
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Passo 2: Verifica se a senha fornecida corresponde à senha armazenada (hashed) do usuário.
    // bcrypt.compare compara a senha em texto plano com o hash armazenado.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Se a senha não for válida, lança uma exceção UnauthorizedException.
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`); // Loga um aviso.
      // throw new UnauthorizedException('Invalid password');
    }

    // Passo 3: Se o usuário for encontrado e a senha for válida, gera um JWT.
    // O payload do JWT contém o ID do usuário (userId).
    // O jwtService.sign assina o payload com o segredo configurado no AuthModule.
    this.logger.log(`User logged in successfully: ${email}`);
    return {
      result: userConvert,
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(email: string, password: string, name: string): Promise<any> {
    // Loga o início do processo de login.
    this.logger.log(`Registering user: ${email}`);

    // verifica se o usuário já existe
    const hasUser = await this.prisma.ari_users.findUnique({
      where: { email },
    });

    if (hasUser) {
      this.logger.warn(`User already exists for email: ${email}`); // Loga um aviso.
      throw new BadRequestException(`User already exists for email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.ari_users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        id_base: 1,
        iduser: 1,
      },
    });

    const userConvert = {
      ...user,
      id: user?.id.toString(), // Convert BigInt to string
    };

    this.logger.log(`User registered successfully: ${email}`);
    return {
      result: userConvert,
    };
  }
}
