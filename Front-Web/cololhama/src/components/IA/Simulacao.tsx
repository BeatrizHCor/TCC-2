import React, { useRef, useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Dialog,
} from '@mui/material';
import { Upload, Download, Palette, Camera, AlertCircle, Loader2 } from 'lucide-react';

interface ResultsType {
  original_color: string;
  colors: {
    analogous: string[];
    complementary: string;
  };
  images: {
    original: string;
    analogous_1: string;
    analogous_2: string;
    complementary: string;
  };
}

const Cololhama: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResults(null); // limpar resultados ao trocar imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione uma imagem primeiro');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/process-hair-color', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(`Erro ao processar imagem: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ColorCard: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: color,
          border: '2px solid #ccc',
          mr: 2,
        }}
      />
      <Box>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="caption" color="text.secondary">{color}</Typography>
      </Box>
    </Card>
  );

  const ImageResult: React.FC<{
    src: string;
    title: string;
    onDownload: () => void;
    onClickImage: () => void;
  }> = ({ src, title, onDownload, onClickImage }) => (
    <Card>
      <CardMedia
        component="img"
        height="180"
        image={src}
        alt={title}
        sx={{ cursor: 'pointer' }}
        onClick={onClickImage}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Button fullWidth variant="contained" onClick={onDownload} startIcon={<Download size={16} />}>
          Baixar
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          <Palette size={32} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Simulador de Cor de Cabelo
        </Typography>
        <Typography variant="subtitle1">
          Faça upload de uma foto e veja como ficaria com diferentes cores de cabelo
        </Typography>
      </Box>

      <Card sx={{ p: 4, mb: 4 }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {!preview ? (
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f3e5f5' },
            }}
          >
            <Camera size={40} style={{ marginBottom: 16 }} />
            <Typography variant="body1">Clique para selecionar uma imagem</Typography>
            <Typography variant="caption" color="text.secondary">ou arraste e solte aqui</Typography>
          </Box>
        ) : (
          <>
            {!results && preview && (
              <Box textAlign="center" mb={4}>
                <img src={preview} alt="Preview" style={{ maxWidth: 300, borderRadius: 8 }} />
              </Box>
            )}
            <Box display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                Escolher Outra Imagem
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={processImage}
                disabled={loading}
                startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <Palette size={16} />}
              >
                {loading ? 'Processando...' : 'Simular Cores'}
              </Button>
            </Box>
          </>
        )}
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertCircle size={16} style={{ marginRight: 8 }} />
          {error}
        </Alert>
      )}

      {results && (
        <>
          <Card sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" mb={2}>Paleta de Cores Detectada</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}><ColorCard color={results.original_color} label="Cor Original" /></Grid>
              <Grid item xs={12} md={3}><ColorCard color={results.colors.analogous[0]} label="Análoga 1" /></Grid>
              <Grid item xs={12} md={3}><ColorCard color={results.colors.analogous[1]} label="Análoga 2" /></Grid>
              <Grid item xs={12} md={3}><ColorCard color={results.colors.complementary} label="Complementar" /></Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" mb={2}>Simulações</Typography>
            <Grid container spacing={2}>
              {[
                { title: 'Original', src: results.images.original },
                { title: 'Análoga 1', src: results.images.analogous_1 },
                { title: 'Análoga 2', src: results.images.analogous_2 },
                { title: 'Complementar', src: results.images.complementary },
              ].map((img, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ImageResult
                    src={img.src}
                    title={img.title}
                    onDownload={() => downloadImage(img.src, `${img.title.toLowerCase()}.jpg`)}
                    onClickImage={() => {
                      setModalImage(img.src);
                      setModalOpen(true);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card sx={{ p: 4 }}>
            <Typography variant="h6" mb={2}>Informações Técnicas</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Cor Original:</strong> {results.original_color}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Processamento:</strong> IA + Análise de Cores</Typography>
              </Grid>
            </Grid>
          </Card>
        </>
      )}

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xl"
        fullWidth
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <Box
          onClick={() => setModalOpen(false)}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
          }}
        >
          {modalImage && (
            <img
              src={modalImage}
              alt="Visualização Ampliada"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Cololhama;
