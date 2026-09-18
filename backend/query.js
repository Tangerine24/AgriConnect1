const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.commodity.findMany().then(c => {
  console.log('Commodities:', c);
}).catch(console.error).finally(() => prisma.$disconnect());
