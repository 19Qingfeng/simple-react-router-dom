/* eslint-disable react/prop-types */
import React from 'react';
import { LocationContext, NavigatorContext } from './context';
import { useRoutes } from './hooks';

/**
 * 该组件为跨平台（适应任何平台下的）路由容器组件
 * @param children 当前 children 子 VDom
 * @param location  当前路径 { pathname, state }
 * @param navigator history 对象，用来进行路径跳转的
 * @param navigatorType 当前路径的 action 类型
 */
export function Router({ children, location, navigator, navigatorType }) {
  return (
    <NavigatorContext.Provider value={{navigator}}>
      <LocationContext.Provider value={location}>
        {children}
      </LocationContext.Provider>
    </NavigatorContext.Provider>
  );
}

/**
 * Routes 核心作用就是读取当前路径，与 children 的 path 进行匹配，按照路径渲染匹配到的组件
 * @param {*} param0
 */
export function Routes({ children }) {
  // 根据 Routes 的 children jsx 元素获取路由列表
  const routes = createRoutesFromChildren(children);
  console.log(routes,'路由列表')
  return useRoutes(routes);
}

/**
 * 格式化 Routes 组件内的 Route ，获得可匹配的列表
 * 将虚拟 Dom 儿子的数组转化为一个普通的对象，方便后续匹配
 */
function createRoutesFromChildren(children) {
  const routes = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      let route = {
        path: child.props.path,
        element: child.props.element
      }
      if(child.props.children) {
        route.children = createRoutesFromChildren(child.props.children)
      }
      routes.push(route);
    }
  });
  return routes;
}

export function Route() {}

export function Outlet() {

}
