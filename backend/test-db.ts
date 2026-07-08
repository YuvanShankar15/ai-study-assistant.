import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log('Connected successfully to MongoDB!');
}).catch(e => {
  console.error('Failed to connect:', e);
});
