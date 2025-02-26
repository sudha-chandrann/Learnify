import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { initEdgeStoreClient } from '@edgestore/server/core';

import { initEdgeStore } from '@edgestore/server';

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});


export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});


export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});