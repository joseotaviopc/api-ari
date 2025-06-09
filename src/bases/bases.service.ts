import { Injectable } from '@nestjs/common';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BasesService {
  private readonly logger = new Logger(BasesService.name);

  constructor(
    private prisma: PrismaService, // Serviço para interagir com o banco de dados.
  ) {}

  create(createBaseDto: CreateBaseDto) {
    return 'This action adds a new base';
  }

  async findAll() {
    this.logger.log(`Finding all bases`);
    return await this.prisma.base.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} base`;
  }

  update(id: number, updateBaseDto: UpdateBaseDto) {
    return `This action updates a #${id} base`;
  }

  remove(id: number) {
    return `This action removes a #${id} base`;
  }
}
