import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Auto-detect Linux Prisma Query Engine binary if running on Linux
if (process.platform === 'linux' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const engineCandidates = [
    '/tmp/prisma-engines/libquery_engine-debian-openssl-1.0.x.so.node',
    '/home/ahmabumi/nodevenv/jalsasalana.ng/20/lib/node_modules/.prisma/client/libquery_engine-debian-openssl-1.0.x.so.node',
    path.resolve(process.cwd(), 'node_modules/.prisma/client/libquery_engine-debian-openssl-1.0.x.so.node'),
    '/home/ahmabumi/jalsasalana.ng/node_modules/.prisma/client/libquery_engine-debian-openssl-1.0.x.so.node',
    '/home/ahmabumi/nodevenv/jalsasalana.ng/20/lib/node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node',
  ];
  for (const c of engineCandidates) {
    if (fs.existsSync(c)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = c;
      break;
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}
