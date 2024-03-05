import {Link} from "react-router-dom";
import {routes} from "../../constants/routes";

export const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <Link to={routes.login}>Login</Link>
    </div>
  )
}
