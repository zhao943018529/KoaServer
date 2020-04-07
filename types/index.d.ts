import { BaseContext } from 'koa';

declare module 'koa' {
  interface BaseContext {
    todos: any[];
  }
}
