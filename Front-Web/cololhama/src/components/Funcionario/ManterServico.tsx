import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useManterServico } from "./useManterServico";
import theme from "../../styles/theme";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../styles/styles.global.css";
import { AuthContext } from "../../contexts/AuthContext";

const ManterServico: React.FC = () => {
  const navigate = useNavigate();
  const { servicoId: servicoId } = useParams();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { doLogout } = useContext(AuthContext);
  const {
    Nome,
    setNome,
    Descricao,
    setDescricao,
    PrecoMin,
    setPrecoMin,
    PrecoMax,
    setPrecoMax,
    SalaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    forbidden,
  } = useManterServico(servicoId);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    handleCloseDeleteDialog();
  };

  useEffect(() => {
    if (forbidden) {
      doLogout();
    }
  }, [forbidden]);

  if (!SalaoId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Acesso não autorizado. Você precisa ser um administrador de salão.
          Id Salao {SalaoId}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEditing ? "Editar Serviço" : "Novo Serviço"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <TextField
                fullWidth
                required
                label="Nome do Serviço"
                value={Nome}
                onChange={(e) => setNome(e.target.value)}
                error={Boolean(validationErrors.nome)}
                helperText={validationErrors.nome}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição"
                value={Descricao}
                onChange={(e) => setDescricao(e.target.value)}
                error={Boolean(validationErrors.descricao)}
                helperText={validationErrors.descricao}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Preço Mínimo"
                  value={PrecoMin === undefined ? "" : PrecoMin}
                  onChange={(e) =>
                    setPrecoMin(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={Boolean(validationErrors.precoMin)}
                  helperText={validationErrors.precoMin}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Preço Máximo"
                  value={PrecoMax === undefined ? "" : PrecoMax}
                  onChange={(e) =>
                    setPrecoMax(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={Boolean(validationErrors.precoMax)}
                  helperText={validationErrors.precoMax}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>

              <Box sx={{ display: "flex", gap: 2 }}>
                {isEditing && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenDeleteDialog}
                  >
                    Excluir
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={isLoading}
                >
                  {isEditing ? "Salvar Alterações" : "Cadastrar Serviço"}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Paper>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este serviço? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManterServico;
