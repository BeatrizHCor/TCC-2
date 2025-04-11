import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useClienteCadastro } from './useCadastroCliente';
import theme from '@/theme/theme';

interface ClienteCadastroProps {
  salaoId?: string;
}

export const ClienteCadastro: React.FC<ClienteCadastroProps> = ({ salaoId }) => {
  const {
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    handleChange,
    handleCPFChange,
    handleTelefoneChange,
    handleConfirmacaoSenhaChange,
    handleSubmit
  } = useClienteCadastro(salaoId || '');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topSection}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Cadastre-se</Text>
          <Text style={styles.subtitle}>Preencha os campos abaixo</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <TextInput
            style={[styles.input, errors.nome && styles.inputError]}
            placeholder="Nome Completo"
            onChangeText={(text) => handleChange('nome', text)}
          />
          {errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <TextInput
                style={[styles.input, errors.CPF && styles.inputError]}
                placeholder="CPF"
                value={cpfFormatado}
                onChangeText={handleCPFChange}
                maxLength={14}
                keyboardType="numeric"
              />
              {errors.CPF && <Text style={styles.error}>{errors.CPF}</Text>}
            </View>
            <View style={styles.halfInput}>
              <TextInput
                style={[styles.input, errors.telefone && styles.inputError]}
                placeholder="Telefone"
                value={telefoneFormatado}
                onChangeText={handleTelefoneChange}
                maxLength={15}
                keyboardType="phone-pad"
              />
              {errors.telefone && <Text style={styles.error}>{errors.telefone}</Text>}
            </View>
          </View>

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => handleChange('email', text)}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={styles.sectionTitle}>Senha</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, errors.senha && styles.inputError]}
                  placeholder="Senha"
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => handleChange('senha', text)}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.icon}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.senha && <Text style={styles.error}>{errors.senha}</Text>}
            </View>

            <View style={styles.halfInput}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, errors.confirmacaoSenha && styles.inputError]}
                  placeholder="Confirmar Senha"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmacaoSenha}
                  onChangeText={handleConfirmacaoSenhaChange}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={styles.icon}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmacaoSenha && <Text style={styles.error}>{errors.confirmacaoSenha}</Text>}
            </View>
          </View>

          <Text style={styles.info}>
            A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.link} activeOpacity={0.7}>
              <Text style={styles.linkText}>Já possui uma conta? Faça login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>CADASTRAR</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f6f6f6' 
  },
  scrollContainer: { 
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  topSection: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  logo: { 
    width: 120, 
    height: 120, 
    resizeMode: 'contain'
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: theme.colors.primary,
    marginTop: 8
  },
  subtitle: { 
    fontSize: 16, 
    color: '#555' 
  },
  formContainer: {
    marginBottom: 20
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 16, 
    marginBottom: 10, 
    color: theme.colors.primary 
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16
  },
  inputError: {
    borderColor: 'red'
  },
  row: { 
    flexDirection: 'row', 
    gap: 8 
  },
  halfInput: { 
    flex: 1 
  },
  error: { 
    color: 'red', 
    marginBottom: 8, 
    fontSize: 12
  },
  passwordContainer: { 
    position: 'relative',
    width: '100%'
  },
  icon: { 
    position: 'absolute', 
    right: 12, 
    top: 12,
    padding: 2
  },
  info: { 
    fontSize: 12, 
    color: '#444', 
    marginVertical: 12 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20 
  },
  link: {
    padding: 4
  },
  linkText: { 
    color: theme.colors.primary 
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  buttonDisabled: { 
    opacity: 0.6 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  }
});

export default ClienteCadastro;