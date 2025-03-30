import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid2,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Phone, Badge, Store } from '@mui/icons-material';
import { useCadastroCliente } from './useCadastroCliente';
import './CadastroCliente.css';

const CadastroClientePage: React.FC = () => {
  const {
    formData,
    errors,
    saloes,
    showPassword,
    snackbar,
    handleInputChange,
    handleSalaoChange,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleCloseSnackbar,
    handleSubmit,
    handleCPFChange,
    handleTelefoneChange
  } = useCadastroCliente();

  return (
    <Container maxWidth="md" className="cadastro-container">
      <Paper elevation={3} className="cadastro-paper">
        <Typography variant="h4" component="h1" gutterBottom align="center" className="cadastro-titulo">
          Cadastro de Cliente
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="cpf"
                name="CPF"
                label="CPF"
                value={formData.CPF}
                onChange={handleCPFChange}
                error={!!errors.CPF}
                helperText={errors.CPF}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge />
                    </InputAdornment>
                  ),
                }}
                className="form-field"
              />
            </Grid2>
            
            <Grid2  size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required error={!!errors.SalaoId} className="form-field">
                <InputLabel id="salao-label">Salão</InputLabel>
                <Select
                  labelId="salao-label"
                  id="salao"
                  name="SalaoId"
                  value={formData.SalaoId}
                  onChange={handleSalaoChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Store />
                    </InputAdornment>
                  }
                >
                  {saloes.map((salao) => (
                    <MenuItem key={salao.CNPJ} value={salao.CNPJ}>
                      {salao.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.SalaoId && (
                  <Typography variant="caption" color="error">
                    {errors.SalaoId}
                  </Typography>
                )}
              </FormControl>
            </Grid2>
            
            <Grid2  size={{ xs: 12}}>
              <TextField
                required
                fullWidth
                id="nome"
                name="Nome"
                label="Nome Completo"
                value={formData.Nome}
                onChange={handleInputChange}
                error={!!errors.Nome}
                helperText={errors.Nome}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                className="form-field"
              />
            </Grid2>
            
            <Grid2  size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="email"
                name="Email"
                type="email"
                label="Email"
                value={formData.Email}
                onChange={handleInputChange}
                error={!!errors.Email}
                helperText={errors.Email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                className="form-field"
              />
            </Grid2>
            
            <Grid2  size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="telefone"
                name="Telefone"
                label="Telefone"
                value={formData.Telefone}
                onChange={handleTelefoneChange}
                error={!!errors.Telefone}
                helperText={errors.Telefone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                className="form-field"
              />
            </Grid2>
            
            <Grid2  size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="senha"
                name="Senha"
                type={showPassword ? 'text' : 'password'}
                label="Senha"
                value={formData.Senha}
                onChange={handleInputChange}
                error={!!errors.Senha}
                helperText={errors.Senha}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="form-field"
              />
            </Grid2>
            
            <Grid2  size={{ xs: 12}} className="btn-container">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="submit-button"
              >
                Cadastrar
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CadastroClientePage;