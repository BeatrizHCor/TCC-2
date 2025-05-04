import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../theme/theme";
import { useRouter } from "expo-router";
import { AuthContext } from "./contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { doLogin } = useContext(AuthContext);
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Formato de email inválido");
      return;
    }
    setLoading(true);
    try {
      await doLogin(email, senha)
      Alert.alert("Login", "Login realizado com sucesso!");
      router.push("/VisualizarCabeleireiros");
    } catch {
      Alert.alert("Erro", "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Bem-vindo!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

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
                style={styles.passwordInput}
                placeholder="Senha"
                secureTextEntry={!showPassword}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
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
                (!validateEmail(email) || senha === "") &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!validateEmail(email) || senha === ""}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/Cadastro")}>
              <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  logo: {
    width: 200,
    height: 150,
    tintColor: "#fff",
    marginBottom: 10,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: theme.colors.grayLight,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
  },
  passwordInput: {
    height: 50,
    borderColor: theme.colors.grayLight,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 13,
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
    marginTop: 20,
    color: theme.colors.primary,
    textAlign: "center",
    fontWeight: "500",
  },
});
