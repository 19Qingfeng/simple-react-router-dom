import React from 'react';

export const LocationContext = React.createContext(null);
export const NavigatorContext = React.createContext(null);
export const RouteContext = React.createContext({
  outlet: null, // 子路由对应的组件
  matches: [] // meta 匹配的结果
}); 
 