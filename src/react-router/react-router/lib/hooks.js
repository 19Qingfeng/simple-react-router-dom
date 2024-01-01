import React from 'react';
import { LocationContext, NavigatorContext } from './context';

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
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (route.path === pathname) {
      return route.element;
    }
  }
}
