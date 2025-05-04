import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "../contexts/AuthContext";
import { DrawerMenu } from "../components/DrawerMenu";

export default function Layout() {
  return (
    <>
      <AuthContextProvider>
        <DrawerMenu />
      </AuthContextProvider>
      <StatusBar style="auto" />
    </>
  );
}
