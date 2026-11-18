import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// If PRISMA_QUERY_ENGINE_LIBRARY points to /tmp, discard it immediately (due to cPanel noexec restriction)
if (process.env.PRISMA_QUERY_ENGINE_LIBRARY && process.env.PRISMA_QUERY_ENGINE_LIBRARY.startsWith('/tmp')) {
  delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
}

// Auto-detect Linux Prisma Query Engine binary if running on Linux
if (process.platform === 'linux' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const rootDir = process.cwd();
  const engineCandidates = [
    '/home/ahmabumi/nodevenv/jalsasalana.ng/20/lib/node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node',
    '/home/ahmabumi/jalsasalana.ng/prisma/engines/libquery_engine-rhel-openssl-1.0.x.so.node',
    '/home/ahmabumi/nodevenv/jalsasalana.ng/20/lib/node_modules/.prisma/client/libquery_engine-debian-openssl-1.0.x.so.node',
    '/home/ahmabumi/jalsasalana.ng/prisma/engines/libquery_engine-debian-openssl-1.0.x.so.node',
    '/home/ahmabumi/nodevenv/jalsasalana.ng/20/lib/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/home/ahmabumi/jalsasalana.ng/prisma/engines/libquery_engine-rhel-openssl-3.0.x.so.node',
    path.resolve(rootDir, 'prisma/engines/libquery_engine-rhel-openssl-1.0.x.so.node'),
    path.resolve(rootDir, 'prisma/engines/libquery_engine-debian-openssl-1.0.x.so.node'),
    path.resolve(rootDir, 'prisma/libquery_engine-rhel-openssl-1.0.x.so.node'),
    path.resolve(rootDir, 'prisma/libquery_engine-debian-openssl-1.0.x.so.node'),
  ];
  for (const c of engineCandidates) {
    if (fs.existsSync(c)) {
      try {
        fs.chmodSync(c, 0o755);
        require(c);
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = c;
        break;
      } catch (_) {}
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}
