import ReactDOM from 'react-dom/client';
// import { BrowserRouter, HashRouter, Routes, Route, Link } from 'react-router-dom';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Link
} from './react-router/react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import { UserList } from './components/UserList';
import { UserAdd } from './components/UserAdd';
import { UserDetail } from './components/UserDetail';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ul>
      <li>
        <Link
          to="/"
          state={{
            name: '首页'
          }}
        >
          首页
        </Link>
      </li>
      <li>
        <Link
          to="/user"
          state={{
            name: '用户'
          }}
        >
          用户
        </Link>
      </li>
      <li>
        <Link
          to="/profile"
          state={{
            name: '信息'
          }}
        >
          信息
        </Link>
      </li>
    </ul>
    <Routes>
      <Route path="/" element={<Home />} />
     
      <Route path="/user" element={<User />}>
        <Route path="list" element={<UserList />} />
        <Route path="add" element={<UserAdd />} />
        <Route path="detail/:id" element={<UserDetail />} />
      </Route>
      <Route path="/profile" element={<Profile />} />


      {/* TODO: 路由优先级，源码中具体规则 */}
      {/* 暂时先保留一个 User，因为优先级多个匹配有问题 */}
      {/* <Route path="/a/b" element={<Home />} /> */}
      {/* <Route path="/a/:id" element={<Profile />} /> */}
    </Routes>
  </BrowserRouter>
);
