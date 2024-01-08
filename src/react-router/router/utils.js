/**
 * 根据 routes/当前 pathname 列表寻找匹配的路由
 * @param {*} routes 路由列表
 * @param {*} location 当前路由对象 { pathname,state }
 */
export function matchRoutes(routes, location) {
  const { pathname } = location;
  // 首先将所有 children 数组打平
  console.log(routes, 'routes');
  let branch = flattenRoutes(routes);
  console.log(branch, 'branch');
  return null;
  // TODO: old
  // let match = null;
  // 当前 pathname
  // for (let i = 0; i < routes.length; i++) {
  //   match = matchPath(routes[i].path, pathname);
  //   if (match) {
  //     // 匹配到的时候 为 match({params: {xxx}})
  //     // 再次添加一个 route ({ element:xxx,path:xxx })当前路由对象
  //     match.route = routes[i];
  //     return match;
  //   }
  // }
  // return null;
}

function joinPaths(paths) {
  return paths.join('/').replace(/\/\/+/g, '/');
}

function flattenRoutes(
  routes,
  branches = [],
  parentsMeta = [],
  parentPath = ''
) {
  function flattenRoute(route, index) {
    // 每个分支都有自己的 meta
    let meta = {
      relativePath: route.path, // 相对于父路径的路径
      route, // 此 Meta 对应的路由信息
      childrenIndex: index // 此 Meta 在父路由的 children 数组中的索引(用于排名计算)
    };
    // 当前路由的 path (截止当前路由匹配的 path)
    let routePath = joinPaths([parentPath, meta.relativePath]);
    // 将父亲的 meta 拼接自己的 meta 组合成为 routesMeta
    const routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, routePath);
    }
    branches.push({
      path: routePath,
      routesMeta
    });
  }

  routes.forEach((route, index) => {
    flattenRoute(route, index);
  });
  return branches;
}



export function matchPath(path, pathname) {
  // 将路径转化为正则
  // matcher 为当前路径匹配的正则规则，  paramsName 为路径参数的集合
  const [matcher, paramsName] = compilePath(path);
  let match = pathname.match(matcher);
  // 未匹配到（不符合）
  if (!match) return null;
  let captureGroups = match.slice(1); // 捕获的参数值分组
  let params = paramsName.reduce((prev, cur, index) => {
    prev[cur] = captureGroups[index];
    return prev;
  }, {});
  return {
    params
  };
}

function compilePath(path, end = true) {
  let paramsNames = [];
  // /home/:id => /home/([^\\/]+)
  let regexpSource =
    '^' +
    path.replace(/\/:(\w+)/g, (_, paramName) => {
      // paramName 为匹配到的第一个分组，既为 name 的 key
      paramsNames.push(paramName);
      return '/([^\\/]+)';
    });

  if (end) {
    regexpSource += '\\/*$';
  }
  let matcher = new RegExp(regexpSource);
  return [matcher, paramsNames];
}
