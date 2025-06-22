import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { Save, X, Check } from 'lucide-react';

interface Salao {
  ID: string;
  Nome: string;
  Endereco?: string;
}

interface SaveSimulationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (salaoId: string) => Promise<boolean>;
  loading: boolean;
  success: boolean;
  error?: string | null;
}

export const SaveSimulationDialog: React.FC<SaveSimulationDialogProps> = ({
  open,
  onClose,
  onSave,
  loading,
  success,
  error,
}) => {
  const [saloes, setSaloes] = useState<Salao[]>([]);
  const [selectedSalao, setSelectedSalao] = useState<Salao | null>(null);
  const [loadingSaloes, setLoadingSaloes] = useState(false);
  const [salaoError, setSalaoError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadSaloes();
    }
  }, [open]);

  const loadSaloes = async () => {
    setLoadingSaloes(true);
    setSalaoError(null);

    try {
      const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000';
      const response = await fetch(`${gatewayUrl}/saloes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar salões');
      }

      const data = await response.json();
      setSaloes(data.saloes || []);
    } catch (error: any) {
      setSalaoError(`Erro ao carregar salões: ${error.message}`);
      setSaloes([]);
    } finally {
      setLoadingSaloes(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSalao) {
      setSalaoError('Por favor, selecione um salão');
      return;
    }

    const success = await onSave(selectedSalao.ID);
    
    if (success) {
      setSelectedSalao(null);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedSalao(null);
      setSalaoError(null);
      onClose();
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Save size={24} />
          <Typography variant="h6" component="span">
            Salvar Simulação
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Escolha o salão para associar esta simulação ao seu histórico
        </Typography>

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            icon={<Check size={20} />}
          >
            Simulação salva com sucesso!
          </Alert>
        )}

        {(error || salaoError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || salaoError}
          </Alert>
        )}

        {loadingSaloes ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Carregando salões...
            </Typography>
          </Box>
        ) : (
          <Autocomplete
            options={saloes}
            getOptionLabel={(option) => `${option.Nome}${option.Endereco ? ` - ${option.Endereco}` : ''}`}
            value={selectedSalao}
            onChange={(_, newValue) => {
              setSelectedSalao(newValue);
              setSalaoError(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecione o salão"
                variant="outlined"
                fullWidth
                error={!!salaoError && !selectedSalao}
                helperText={salaoError && !selectedSalao ? 'Campo obrigatório' : ''}
              />
            )}
            disabled={loading || success}
            noOptionsText="Nenhum salão encontrado"
            loadingText="Carregando..."
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<X size={16} />}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !selectedSalao || success}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Save size={16} />
            )
          }
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};