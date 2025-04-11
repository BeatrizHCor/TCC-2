import React, { useState } from "react";
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
import theme from "../theme/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email:string) =>
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
          <View style={styles.container}>
            <View style={styles.topSection}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Login</Text>
            </View>

            <View style={styles.bottomSection}>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  topSection: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    tintColor: theme.colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  bottomSection: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 17,
    color: theme.colors.grayDark,
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
    marginTop: 15,
    color: theme.colors.primary,
    textAlign: "center",
  },
});