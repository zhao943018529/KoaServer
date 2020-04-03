import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/test/timeout', async ctx => {
  ctx.body = await new Promise(function (resolve, reject) {
    setTimeout(() => resolve('I am iron!!!'), 5000);
  });
});

router.get('/test/json', ctx => {
  ctx.type = 'application/json;charset=utf-8';
  ctx.body = {
    apple: 1,
    microsoft: 2,
    tesla: 3,
  };
});

// app.use(async (ctx) => {
//   ctx.body = 'Hello world';
// });

app.use(router.routes()).use(router.allowedMethods());

app.listen(7071, () => {
  console.log('koa server is running on port: 7071');
});
