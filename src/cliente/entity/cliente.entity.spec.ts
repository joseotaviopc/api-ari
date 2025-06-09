import { ClienteEntity } from '../entity/cliente.entity';

describe('ClienteEntity', () => {
  it('should be defined', () => {
    expect(new ClienteEntity({})).toBeDefined(); // Passa um objeto vazio para o construtor
  });
});
