import { PrismaService } from 'nestjs-prisma';
import { ClienteRepository } from './cliente.repository';

describe('ClienteRepository', () => {
  it('should be defined', () => {
    expect(new ClienteRepository(new PrismaService())).toBeDefined();
  });
});
