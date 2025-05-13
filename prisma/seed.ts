import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  console.log(`Start seeding ...`);
  const passwordAlice = await bcrypt.hash('password123', roundsOfHashing);
  const passwordBob = await bcrypt.hash('password456', roundsOfHashing);

  const userAlice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {
      password: passwordAlice,
    },
    create: {
      email: 'alice@prisma.io',
      username: 'Alice',
      password: passwordAlice,
    },
  });

  const userBob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {
      password: passwordBob,
    },
    create: {
      email: 'bob@prisma.io',
      username: 'Bob',
      password: passwordBob,
    },
  });

  console.log(
    `Seeding finished., ${userAlice.password}`,
    `${userBob.password}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
