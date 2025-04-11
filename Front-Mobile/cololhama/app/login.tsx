import React, { useState } from "react";
import { Drawer } from "expo-router/drawer";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Formato de email inválido");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Login", "Login realizado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Drawer.Screen
        options={{
          title: "Login",
          drawerLabel: "Login",
        }}
      />

      <View style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Acesse sua conta</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color={theme.colors.grayDark}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!validateEmail(email) || senha === "") && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!validateEmail(email) || senha === ""}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert("Cadastro")}>
            <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayLighter,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  loginBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.grayDark,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: theme.colors.grayLight,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: theme.colors.grayLight,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: theme.colors.primary,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
    tintColor: theme.colors.primary,
  },
});
