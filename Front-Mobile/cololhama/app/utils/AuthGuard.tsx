import { ReactElement, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { userTypes } from "../models/tipo-usuario.enum";
interface PropsAuthGuard {
  children: ReactElement;
  allowed?: userTypes[];
}

const AuthGuard = ({ children, allowed }: PropsAuthGuard) => {
  const { checkLocalStorage, userType, doLogout } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    checkLocalStorage().then((e) => {
      console.log(e);
      if (!e || (allowed && !allowed.includes(userType!))) {
        doLogout();
        router.push("/login");
      }
    });
  }, [userType]);

  return <>{children}</>;
};

export default AuthGuard;
