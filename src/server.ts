import Koa from 'koa';
import Router from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import * as _ from 'lodash';

const app = new Koa();

app.use(
  KoaBodyParser({
    formLimit: '1mb',
  }),
);

const router = new Router();

const user = {
  username: 'admin',
  password: '123',
};

router.post('/login', ctx => {
  const body = ctx.request.body;
  if (body.username === user.username && body.password === user.password) {
    ctx.user = user;
  }
});

router.use(async (ctx, next) => {
  if (/^\/login/.test(ctx.path) || ctx.user != null) {
    next();
  } else {
    ctx.throw(401, 'access_denied');
  }
});

const todos = [];

router.post('addTodo', ctx => {
  const todo = ctx.request.body;
  todo.id = _.uniqueId('todo');
  todos.push(todo);
  ctx.body = todo;
});

router.post('/updateTodo', ctx => {
  const body = ctx.request.body;
  const target = _.find(todos, { id: body.id });
  if (target != null) {
    Object.assign(target, body);
  }

  ctx.body = target;
});

router.get('/todos', ctx => {
  const status = ctx.request.body.status;
  let result;
  switch (status) {
    case 1:
      result = todos.filter(todo => todo.completed);
      break;
    case 2:
      result = todos.filter(todo => !todo.completed);
      break;
    default:
      result = todos;
      break;
  }
  ctx.body = result;
});

router.post('/deleteTodo', ctx => {
  const body = ctx.request.body;
  const index = _.findIndex(todos, todo => todo.id === body.id);
  if (index !== -1) {
    todos.split(index, 1);
  }
});

router.get('/test/timeout', async ctx => {
  ctx.body = await new Promise(function (resolve, reject) {
    setTimeout(() => resolve('I am iron!!!'), 5000);
  });
});

router.get('/test/json', ctx => {
  // throw Error('wahaha');
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
