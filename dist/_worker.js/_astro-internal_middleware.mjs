globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import './chunks/astro-designed-error-pages_DQnM3Zi_.mjs';
import './chunks/astro/server_BDhFni3J.mjs';
import { s as sequence } from './chunks/index_DW_O1FxG.mjs';
=======
import './chunks/astro-designed-error-pages_CCYNKBTV.mjs';
import './chunks/astro/server_CDFI50iS.mjs';
import { s as sequence } from './chunks/index_CqyuteZu.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

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
