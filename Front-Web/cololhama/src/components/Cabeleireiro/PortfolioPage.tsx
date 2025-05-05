import React, { useState } from "react";
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
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { usePortfolio } from "./usePortfolioPage";

export default function PortfolioPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const { 
    imagens, 
    loading, 
    error, 
    uploadImagem, 
    fetchImagens, 
    IMAGEM_URL 
  } = usePortfolio(portfolioId);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !portfolioId) return;
    
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
          Portfólio {portfolioId ? `#${portfolioId}` : ""}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenDialog(true)}
          disabled={loading}
        >
          Adicionar Imagem
        </Button>
      </Box>

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
            tamanaho do arrey {imagens.length}
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
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  image={`data:image/jpeg;base64,${img.fileContent}`} // usando o conteúdo Base64
                  alt={img.Descricao}
                  sx={{
                    height: 240,
                    objectFit: "cover", 
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x300?text=Imagem+não+encontrada";
                  }}
                />
                <CardContent>
                  <Typography variant="body2">{img.Descricao}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Dialog para upload de imagem */}
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

      {/* Notificação de sucesso */}
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