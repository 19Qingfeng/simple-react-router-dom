import React from 'react';
import { LocationContext, NavigatorContext } from './context';
import { matchRoutes } from '../../router';

export function useLocation() {
  return React.useContext(LocationContext);
}

/**
 * 该 hook 和 Routes 组件的作用一样，都是用来匹配当前路径的
 * 用当前路径和传入的 routes 里面的 path 进行匹配，如果匹配上则渲染对应的 element
 * @param {*} routes
 */
export function useRoutes(routes) {
  const location = useLocation(LocationContext);
  const { pathname } = location;
  let matches = matchRoutes(routes, { pathname });
  

  const match = matchRoutes(routes, location);
  console.log(match, '匹配的路由');
  return match.route.element;
}

export function useNavigate() {
  // TODO: Data Api (useLoaderData) 的实现
  const { navigator } = React.useContext(NavigatorContext);
  const navigate = React.useCallback((to, state) => {
    navigator.push(to, state);
  }, []);
  return navigate;
}

export function useParams() {}