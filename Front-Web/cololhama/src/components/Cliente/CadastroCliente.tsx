import "../../styles/styles.global.css";
import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Box, 
  InputAdornment, 
  IconButton, 
  LinearProgress,
  Alert,
  SlotCommonProps,
  SlotProps,
  mergeSlotProps,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useClienteCadastro } from './useCadastroCliente';

interface ClienteCadastroProps {
  salaoId: string;
}

export const ClienteCadastro: React.FC<ClienteCadastroProps> = ({ salaoId }) => {
  const {
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    handleChange,
    handleAuthChange,
    handleCPFChange,
    handleTelefoneChange,
    handleConfirmacaoSenhaChange,
    handleSubmit
  } = useClienteCadastro(salaoId);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {loading && <LinearProgress />}
          
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Cadastro-se
          </Typography>
          
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            Preencha os campos abaixo
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <Typography variant="h6">Informações Pessoais</Typography>
              
              <TextField
                name="nome"
                label="Nome Completo"
                fullWidth
                required
                onChange={handleChange}
                error={!!errors.nome}
                helperText={errors.nome}
              />
              
              <TextField
                label="CPF"
                fullWidth
                required
                value={cpfFormatado}
                onChange={handleCPFChange}
                error={!!errors.CPF}
                helperText={errors.CPF}
                slotProps={{ htmlInput: { maxLength: 14 } }}
              />
              
              <TextField
                name="email"
                label="Email"
                fullWidth
                required
                type="email"
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              
              <TextField
                label="Telefone"
                fullWidth
                required
                value={telefoneFormatado}
                onChange={handleTelefoneChange}
                error={!!errors.telefone}
                helperText={errors.telefone}
                slotProps={{ htmlInput: { maxLength: 15 } }}
              />
              
              <Typography variant="h6" sx={{ mt: 2 }}>Senha</Typography>
              
              <TextField
                name="senha"
                label="Senha"
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                onChange={handleAuthChange}
                error={!!errors.senha}
                helperText={errors.senha}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
              
              <TextField
                label="Confirmar Senha"
                fullWidth
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmacaoSenha}
                onChange={handleConfirmacaoSenhaChange}
                error={!!errors.confirmacaoSenha}
                helperText={errors.confirmacaoSenha}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
              
              <Alert severity="info" sx={{ mt: 2 }}>
                A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
              </Alert>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Já possui uma conta? Faça login
                </MuiLink>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ClienteCadastro;

