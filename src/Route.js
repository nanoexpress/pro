import { httpMethods } from './helpers/index.js';

export default class Route {
  constructor() {
    this._routers = [];
    this._ws = [];
    this._pubs = [];
    this._app = null;
    this._basePath = '';

    return this;
  }

  use(path, ...middlewares) {
    if (typeof path === 'function') {
      middlewares.unshift(path);
      path = '*';
    }
    middlewares.forEach((handler) => {
      if (this._app) {
        const routePath =
          // eslint-disable-next-line no-nested-ternary
          this._basePath === '*'
            ? '*'
            : path === '/'
            ? this._basePath
            : this._basePath + path;
        this._app._router.all(routePath, handler);
      } else {
        this._routers.push({ method: httpMethods, path, handler });
      }
    });

    return this;
  }
}

for (let i = 0, len = httpMethods.length; i < len; i += 1) {
  const method = httpMethods[i].toLowerCase();
  Route.prototype[method] = function defineRouter(path, ...handlers) {
    handlers.forEach((handler) => {
      if (this._app) {
        const routePath =
          // eslint-disable-next-line no-nested-ternary
          this._basePath === '*'
            ? '*'
            : path === '/'
            ? this._basePath
            : this._basePath + path;
        this._app._router.on(method.toUpperCase(), routePath, handler);
      } else {
        this._routers.push({ method: method.toUpperCase(), path, handler });
      }
    });
    return this;
  };
}

// PubSub methods expose
Route.prototype.publish = (topic, message, isBinary, compress) => {
  this._pubs.push({ topic, message, isBinary, compress });
  return this;
};

Route.prototype.ws = function wsExpose(path, handler, options = {}) {
  if (typeof handler === 'object') {
    options = handler;
    handler = null;
  }

  if (typeof options.open === 'function') {
    this._ws.push({ path, handler: options });
    return this;
  }

  this._ws.push({ path, handler, options });

  return this;
};
