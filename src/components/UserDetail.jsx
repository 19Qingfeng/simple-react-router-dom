import { useLocation, useParams } from "../react-router/react-router-dom";

export function UserDetail() {

  const params = useParams()

  const { state } = useLocation()
  return <div>
    <p>用户:{state?.userName}</p>
    <p>数据:{params?.id}</p>
  </div>
}