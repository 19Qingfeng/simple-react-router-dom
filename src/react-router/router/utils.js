/**
 * 根据 routes/当前 pathname 列表寻找匹配的路由
 * @param {*} routes 路由列表
 * @param {*} location 当前路由对象 { pathname,state }
 */
export function matchRoutes(routes, location) {
  const { pathname } = location;
  let match = null;
  // 当前 pathname
  for (let i = 0; i < routes.length; i++) {
    match = matchPath(routes[i].path, pathname);
    if (match) {
      // 匹配到的时候 为 match({params: {xxx}})
      // 再次添加一个 route ({ element:xxx,path:xxx })当前路由对象
      match.route = routes[i];
      return match;
    }
  }
  return null;
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
