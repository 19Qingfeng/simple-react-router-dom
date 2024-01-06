import { Link } from "react-router-dom";

export function UserList() {
  return (
    <div>
      <h3>User List</h3>
      <ul>
        <li>
          <Link to="/user/detail/1" state={{
            userName: '张三'
          }} >张三</Link>
        </li>
        <li>
          <Link to="/user/detail/2" state={{
            userName: '李四'
          }}>李四</Link>
        </li>
      </ul>
    </div>
  );
}
