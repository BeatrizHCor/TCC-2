import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { usePortfolio } from "./usePortfolioPage";
import { AuthContext } from "../../contexts/AuthContext";

export default function PortfolioPage() {
  const { cabeleireiroId } = useParams<{ cabeleireiroId: string }>();
  const {
    imagens,
    loading,
    error,
    uploadImagem,
    deleteImagem,
    fetchImagens,
    portfolioId,
    nomeCabeleireiro,
    DescricaoPort
  } = usePortfolio(cabeleireiroId);
  const { userType, userId } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);


  const handleDeleteImage = async () => {
    if (!selectedImage) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteImagem(selectedImage.ID);
      setDeleteDialog(false);
      setSelectedImage(null);
      setShowSuccess(true);
    } catch (err) {
      setDeleteError("Falha ao excluir a imagem. Tente novamente.");
      console.error("Erro durante exclusão:", err);
    } finally {
      setDeleting(false);
    }
  };
  const handleUpload = async () => {
    if (!file || !cabeleireiroId) return;

    setUploading(true);
    setUploadError(null);

    try {
      await uploadImagem(file, descricao);
      setOpenDialog(false);
      setDescricao("");
      setFile(null);
      setShowSuccess(true);
    } catch (err) {
      setUploadError("Falha ao fazer upload da imagem. Tente novamente.");
      console.error("Erro durante upload:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Portfólio: {nomeCabeleireiro ? ` ${nomeCabeleireiro}` : ""}
        </Typography>
        {cabeleireiroId === userId ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            disabled={loading}
          >
            Adicionar Imagem
          </Button>
        ) : null}
      </Box>
      <Typography variant="h6" component="h3" color="text.secondary">
        Descrição: {DescricaoPort ? ` ${DescricaoPort}` : ""}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : imagens.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            border: '1px dashed grey'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Portfólio vazio!
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Clique em "Adicionar Imagem" para começar a construir seu portfólio.
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={2}>
          {imagens.map((img) => (
            <Box
              key={img.ID}
              sx={{
                width: {
                  xs: "90%",
                  sm: "50%",
                  md: "33.33%",
                },
                boxSizing: "border-box",
                padding: 1,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  "&:hover .delete-overlay": {
                    opacity: cabeleireiroId === userId ? 1 : 0
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={`data:image/jpeg;base64,${img.fileContent}`}
                  alt={img.Descricao}
                  sx={{
                    height: 240,
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("imagem-nao-encontrada.png")) {
                      target.src = "/imagem-nao-encontrada.png";
                    }
                  }}
                />
                {cabeleireiroId === userId && (
                  <Box
                    className="delete-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setSelectedImage(img);
                      setDeleteDialog(true);
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ minWidth: "auto", p: 1 }}
                    >
                      🗑️ Excluir
                    </Button>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="body2">{img.Descricao}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={() => !uploading && setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Adicionar Imagem ao Portfólio</DialogTitle>
        <DialogContent>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Descrição da imagem"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            margin="normal"
            disabled={uploading}
            required
          />

          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Selecione uma imagem:
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ width: "100%" }}
            />
          </Box>

          {file && (
            <Box mt={2} textAlign="center">
              <Typography variant="caption" display="block" gutterBottom>
                Preview:
              </Typography>
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !descricao.trim() || uploading}
            variant="contained"
            color="primary"
          >
            {uploading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialog}
        onClose={() => !deleting && setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}

          <Typography variant="body1" gutterBottom>
            Tem certeza que deseja excluir esta imagem do seu portfólio?
          </Typography>

          {selectedImage && (
            <Box mt={2} textAlign="center">
              <img
                src={`data:image/jpeg;base64,${selectedImage.fileContent}`}
                alt={selectedImage.Descricao}
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "4px" }}
              />
              <Typography variant="caption" display="block" mt={1}>
                {selectedImage.Descricao}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" mt={2}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteImage}
            disabled={deleting}
            variant="contained"
            color="error"
          >
            {deleting ? <CircularProgress size={24} /> : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Imagem adicionada com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}