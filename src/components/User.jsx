import { Link } from '../react-router/react-router-dom';
import { Outlet } from '../react-router/react-router-dom';

function User() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/user/list">UserList</Link>
        </li>
        <li>
          <Link to="/user/add">UserAdd</Link>
        </li>
      </ul>
      <p>User Module:</p>
      <Outlet />
    </div>
  );
}

export default User;
