/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import { useState } from 'react';
import { Router, useLocation, useNavigate } from '../react-router/index.js';
// import { createBrowserHistory, createHashHistory } from '@remix-run/router';
import { createBrowserHistory, createHashHistory } from '../router';
import { useLayoutEffect } from 'react';
import { useRef } from 'react';
export {
  Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useRoutes
} from '../react-router/index.js';

export function BrowserRouter({ children }) {
  const historyRef = useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory();
  }
  const history = historyRef.current; // 创建历史对象（模拟浏览器的历史对象）
  // 定义状态，获取当前历史对象中的路径
  const [state, setState] = useState({
    action: history.action, // 表示当前执行的为那个动作 push/pop
    location: history.location // 当前的路径信息
  });

  // 为 history 添加监听函数，当路径发生变化时，会执行 setState 传递最新的路径。
  // 同时重新渲染路由容器组件
  useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);
  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navigatorType={state.action}
    />
  );
}

export function HashRouter({ children }) {
  const historyRef = useRef();
  if (historyRef == null) {
    historyRef.current = createHashHistory();
  }
  const history = historyRef.current; // 创建历史对象（模拟浏览器的历史对象）

  // 定义状态，获取当前历史对象中的路径
  const [state, setState] = useState({
    action: history.action, // 表示当前执行的为那个动作 push/pop
    location: history.location // 当前的路径信息
  });

  // 为 history 添加监听函数，当路径发生变化时，会执行 setState 传递最新的路径。
  // 同时重新渲染路由容器组件
  useLayoutEffect(() => {
    history.listen(() => history.listen(setState));
  }, [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navigatorType={state.action}
    />
  );
}

export function Link({ to, state, ...rest }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to, state);
  };
  return <a onClick={handleClick} {...rest} />;
}

/**
 * 导航链接
 * @param {*} param0 
 */
export function NavLink({ to, state, className: classNameProps, style: styleProps, end = false, ...rest }) {
  // 获取当前页面路径 TODO: 动态路由未处理
  let { pathname } = useLocation()
  console.log(pathname,'pathname',pathname.chatAt)
  let isActive = pathname === to || (!end && pathname.startsWith(to) && pathname.charAt(to.length) === '/')

  let className = classNameProps && classNameProps({ isActive })
  let style = styleProps && styleProps({ isActive })

  return <Link className={className} style={style} to={to} state={state} {...rest} />
}
