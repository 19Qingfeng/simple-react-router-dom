/**
 * 匹配路径参数正则
 */
const paramRe = /^:[\w-]+$/;
/**
 * 动态路由
 */
const dynamicSegmentValue = 3;
/**
 * 跟路由
 */
const indexRouteValue = 2;
/**
 * 空的路由
 */
const emptySegmentValue = 1;
/**
 * 静态(固定路径 比如 /user/list) 中 user 和 list 都是 static 片段
 */
const staticSegmentValue = 10;
/**
 * 通配符
 */
const splatPenalty = -2;
const isSplat = (s) => s === '*';

/**
 * 计算每一个路径对应的分数
 * 用于路由路径优先级匹配
 * (相同路由路径匹配下) 纯静态 >> 动态 >> 通配符
 * @param {*} path
 * @param {*} index
 */
function computedScore(path, index) {
  let segments = path.split('/');
  // 初始分为片段长度
  let initialScore = segments.length;
  // 该路由路径中如果存在单个通配符（*） 减分
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  // TODO: 这里的 index 需要 debugger 源码，具体为了区别啥
  // TODO: debugger 下 单/ 的分数
  if (index) {
    initialScore += indexRouteValue;
  }

  return (
    segments
      // 首先过滤该路由数组中的通配符(*)，拿到费 * 片段
      .filter((s) => !isSplat(s))
      .reduce(
        (score, segment) =>
          score +
          (paramRe.test(segment)
            ? dynamicSegmentValue
            : segment === ''
            ? emptySegmentValue
            : staticSegmentValue),
        initialScore
      )
  );
}

/**
 * 比较路由先后顺序
 * 优先分数 其次 索引(childrenIndex) TODO: 对照源码
 */
function rankRouteBranches() {}

/**
 * TODO: 一步一步看 TODO:!!!
 * 根据 routes/当前 pathname 列表寻找匹配的路由
 * @param {*} routes 路由列表
 * @param {*} location 当前路由对象 { pathname,state }
 */
export function matchRoutes(routes, location) {
  const { pathname } = location;
  // 首先将所有 children 数组打平
  let branches = flattenRoutes(routes);
  // 按照分数对于路由进行排序
  rankRouteBranches();
  let matches = null;

  for (let i = 0; matches === null && i < branches.length; i++) {
    const branch = branches[i];
    matches = matchRouteBranches(branch, pathname);
  }

  return matches;
}

function matchRouteBranches(branch, pathname) {
  let { routesMeta } = branch;
  let matchPathName = '/'; // 目前已经匹配到的路径名
  let matchParams = {}; // 记录路由参数对象
  let matches = [];

  for (let i = 0; i < routesMeta.length; i++) {
    // 获取当前路由对象的 relativePath  (['/user','detail/:id'])
    const { relativePath, route } = routesMeta[i];
    // 判断是否为最后一个 meta
    const end = routesMeta.length - 1 === i;
    // 剩余需要匹配的路径名
    let remainingPathname =
      matchPathName === '/'
        ? pathname
        : pathname.slice(matchPathName.length) || '';
    // 路径匹配(最后一个路径时需要末尾匹配)
    const match = matchPath({ path: relativePath, end }, remainingPathname);
    if (!match) {
      return null;
    }
    // 添加路由 Params TODO: 源码也是这么写的，得看看 Demo 对比下（父是否可以拿到子的 params，理论上应该是可以的）
    Object.assign(matchParams, match.params);
    // 重新计算当前已经匹配到的路径名 matchPathName(已经匹配过的路径) + match.pathname(本次匹配的路径)
    matchPathName = joinPaths([matchPathName, match.pathname]);
    // 将匹配到的结果放入
    matches.push({
      params: matchParams,
      route,
      pathname: matchPathName // 当前 matches 中匹配到的路由
    });
  }
  return matches;
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
      relativePath: route.path, // 此路由相对于父路径的路径
      route, // 此 Meta 对应的路由信息，保存当前路由 path 以及 element
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
      routesMeta,
      score: computedScore(routePath, index)
    });
  }

  routes.forEach((route, index) => {
    flattenRoute(route, index);
  });
  console.log(branches, 'branches');
  return branches;
}

/**
 * 检查路径是否匹配
 * @param {*} path 需要匹配的 pathname
 * @param {*} pathname 当前 pathname
 * @returns
 */
export function matchPath({ path, end }, pathname) {
  // 将路径转化为正则
  // matcher 为当前路径匹配的正则规则，  paramsName 为路径参数的集合
  const [matcher, paramsName] = compilePath(path, end);
  let match = pathname.match(matcher);
  // 未匹配到（不符合）
  if (!match) return null;
  let matchPathName = match[0]; // 匹配到的路径名
  let captureGroups = match.slice(1); // 捕获的参数值分组
  let params = paramsName.reduce((prev, cur, index) => {
    prev[cur] = captureGroups[index];
    return prev;
  }, {});
  return {
    params,
    pathname: matchPathName
  };
}

/**
 * 将路径转为正则
 * @param {*} path
 * @param {*} end
 * @returns
 */
function compilePath(path, end = true) {
  let paramsNames = [];
  // /home/:id => /home/([^\\/]+)
  let regexpSource =
    '^' +
    path
      // 忽略 URL 尾部的 /* 或者 * 或者 ////* (处理通配符)
      .replace(/\/*\*?$/, '')
      // 分段匹配替换不存在 / 时，增加 /。 Make sure it has a leading / (将非 / 开头的转为 / （开头增加 /）)
      .replace(/^\/*/, '/')
      // Ignore trailing / 忽略路径尾部的 /
      // .replace(/\/+$/, '')
      // 将动态路由参数转化为具体数值正则匹配
      .replace(/\/:(\w+)/g, (_, paramName) => {
        // paramName 为匹配到的第一个分组，既为 name 的 key
        paramsNames.push(paramName);
        return '/([^\\/]+)';
      });

  // 如何 path 以 * 结尾，path 中间的*不会认为是任意匹配，只会当 path 结尾为 * 时才代表任意匹配
  if (path.endsWith('*')) {
    paramsNames.push('*');
    // 此时需要判断该路由 * 是否为唯一路径
    regexpSource +=
      path === '*' || path === '/*'
        ? // 该路径下全匹配
          '(.*)$'
        : // 非全路径时，匹配时候忽略后部单个 /
          // 比如 /home/123 则 params 为 { *:123 }
          // /home//// params 为 { *: /// }
          '(?:\\/(.+)|\\/*)$';
  } else if (end) {
    regexpSource += '\\/*$';
  }

  let matcher = new RegExp(regexpSource);
  return [matcher, paramsNames];
}

function joinPaths(paths) {
  return paths.join('/').replace(/\/\/+/g, '/');
}
