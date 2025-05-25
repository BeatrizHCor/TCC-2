import { ReactElement, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { userTypes } from "../models/tipo-usuario.enum";
interface PropsAuthGuard {
  children: ReactElement;
  allowed?: userTypes[];
}

const AuthGuard = ({ children, allowed }: PropsAuthGuard) => {
  const { checkLocalStorage, userType, doLogout } = useContext(AuthContext);
  const [reroute, setReroute] = useState(false);

  useEffect(() => {
    checkLocalStorage().then((e) => {
      console.log(e);
      if (!e || (allowed && !allowed.includes(userType!))) {
        doLogout();
        setReroute(true);
      }
    });
  }, [userType]);

  return (
    <>
      {reroute ? <Navigate to={"/login"} /> : null}
      {children}
    </>
  );
};

export default AuthGuard;
