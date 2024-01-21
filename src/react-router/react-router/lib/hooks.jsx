import React from 'react';
import { LocationContext, NavigatorContext, RouteContext } from './context';
import { matchRoutes } from '../../router';
import { useContext } from 'react';

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

  // const match = matchRoutes(routes, location);
  if (matches) {
    return renderMatches(matches);
  }
  return null;
}

function renderMatches(renderMatches) {
  return renderMatches.reduceRight((outlet, match, index) => {
    const matches = renderMatches.slice(0, index + 1)
    // 从子元素开始渲染
    return <RouteContext.Provider value={{
      outlet,
      matches // 当前匹配的 match 对象
    }}>
      {match.route.element}
    </RouteContext.Provider>
  }, null);
}

export function useOutlet() {
  const { outlet } = useContext(RouteContext)
  return outlet
}

export function useNavigate() {
  // TODO: Data Api (useLoaderData) 的实现
  const { navigator } = React.useContext(NavigatorContext);
  const navigate = React.useCallback((to, state) => {
    navigator.push(to, state);
  }, []);
  return navigate;
}

export function useParams() {
  const { matches } = React.useContext(RouteContext);
  // 获取当前的 params 参数
  return matches[matches.length - 1].params;
}