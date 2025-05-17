import { ReactElement, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
interface PropsAuthGuard {
  children: ReactElement;
}

const AuthGuard = ({ children }: PropsAuthGuard) => {
  const { checkLocalStorage } = useContext(AuthContext);
  const [reroute, setReroute] = useState(false);

  useEffect(() => {
    checkLocalStorage().then((e) => {
      if (!e) {
        setReroute(true);
      }
    });
  }, []);

  return (
    <>
      {reroute ? null : <Navigate to={"/login"} />}
      {children}
    </>
  );
};

export default AuthGuard;
