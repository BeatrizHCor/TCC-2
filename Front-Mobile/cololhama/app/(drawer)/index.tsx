import { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { token } = useContext(AuthContext);
  return (
    <Redirect href={`${token === "" ? "/login" : "/VisualizarServicos"}`} />
  );
}
