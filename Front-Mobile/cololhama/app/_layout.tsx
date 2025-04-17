import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
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
          options={{ drawerLabel: "Início" }}
        />
        <Drawer.Screen
          name="login"
          options={{ drawerLabel: "Login" }}
        />
        <Drawer.Screen
          name="cadastro"
          options={{ drawerLabel: "Cadastro" }}
        />
        <Drawer.Screen
          name="VisualizarServicos"
          options={{ drawerLabel: "Serviços" }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </>
  );
}
