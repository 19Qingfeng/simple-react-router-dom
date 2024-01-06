import { useLocation } from "react-router-dom";

export function UserDetail() {
  const { state } = useLocation()
  return <div>
    用户:<p>{state?.userName}</p>
  </div>
}