globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_SKi-_9zR.mjs';
import './chunks/astro/server_HpSis98d.mjs';
import { s as sequence } from './chunks/index_D9Fp7RMG.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
