import Drawer from "expo-router/drawer";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const DrawerMenu = () => {
  const { token, userType } = useContext(AuthContext);
  const requiresLogged = () => {
    return token ? "flex" : "none";
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerStyle: {
          backgroundColor: "#fff",
          width: 240,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Início",
          title: "Inicio",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Login"
        options={{
          drawerLabel: "Login",
          drawerItemStyle: { display: `${token ? "none" : "flex"}` },
        }}
      />
      <Drawer.Screen
        name="Cadastro"
        options={{
          drawerLabel: "Cadastro",
          drawerItemStyle: { display: `${token ? "none" : "flex"}` },
        }}
      />
      <Drawer.Screen
        name="VisualizarServicos"
        options={{ drawerLabel: "Serviços", title: "Serviços" }}
      />
      <Drawer.Screen
        name="VisualizarCabeleireiros"
        options={{
          drawerLabel: "Cabeleireiro",
          title: "Cabeleireiros",
        }}
      />
    </Drawer>
  );
};
