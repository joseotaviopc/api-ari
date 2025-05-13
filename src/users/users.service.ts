// src/users/users.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating user');

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    this.logger.log('Finding all users');
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    this.logger.log(`Finding user with ID: ${id}`);
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    this.logger.log(`Finding user with email: ${email}`);
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with ID: ${id}`);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    this.logger.log(`Removing user with ID: ${id}`);
    return await this.prisma.user.delete({ where: { id } });
  }
}
