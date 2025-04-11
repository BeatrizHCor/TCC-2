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
      />
      <StatusBar style="auto" />
    </>
  );
}
