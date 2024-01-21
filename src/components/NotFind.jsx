import { useParams } from "../react-router/react-router";

export function NotFind() {
  const params = useParams()
  console.log(params,'params')
  return <div>NotFind</div>;
}
