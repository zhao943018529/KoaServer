import Koa from 'koa';
import Router from 'koa-router';
import KoaBodyParser from 'koa-bodyparser';
import * as _ from 'lodash';

interface ITodo {
  completed: Boolean;
  id: String;
  name: String;
  time: Number;
}

interface IResponseBody {
  code?: Number;
  message?: String;
}

interface ICustomContext {
  todos: ITodo[];
  body?: IResponseBody;
}

const app = new Koa<{}, ICustomContext>();

app.use(
  KoaBodyParser({
    formLimit: '1mb',
  }),
);

app.context.todos = [];
const router = new Router<{}, ICustomContext>();

const user = {
  username: 'admin',
  password: '123',
};

router.post('/login', ctx => {
  const { body } = ctx.request;
  if (body.username === user.username && body.password === user.password) {
    // ctx.user = user;
  }
});

// router.use(async (ctx, next) => {
//   if (/^\/login/.test(ctx.path) || ctx.user != null) {
//     next();
//   } else {
//     ctx.throw(401, 'access_denied');
//   }
// });

router.post('/addTodo', ctx => {
  const todo = ctx.request.body;
  todo.id = _.uniqueId('todo');
  ctx.todos.push(todo);
  ctx.body = todo;
});

router.post('/updateTodo', ctx => {
  const body = ctx.request.body;
  const target = _.find(ctx.todos, { id: body.id });
  if (target != null) {
    Object.assign(target, body);
  }

  ctx.body = target;
});

router.get('/todos/:type', ctx => {
  const type = parseInt(ctx.params.type || 0);
  let todos = ctx.todos;
  let result;
  switch (type) {
    case 1:
      result = todos.filter(todo => !todo.completed);
      break;
    case 2:
      result = todos.filter(todo => todo.completed);
      break;
    default:
      result = todos;
      break;
  }
  ctx.body = result;
});

router.post('/deleteTodo', ctx => {
  const { body } = ctx.request;
  const index = _.findIndex(ctx.todos, todo => todo.id === body.id);
  if (index !== -1) {
    ctx.todos.splice(index, 1);
  }

  ctx.body = {
    code: 200,
    message: 'delete successfully!!!',
  };
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
