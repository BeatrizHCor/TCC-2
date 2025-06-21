// pages/HairColorSimulator.tsx

import React, { useRef, useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Dialog,
} from '@mui/material';
import { Download, Palette, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { IAService, ResultsType } from '../../services/IaService';
import { useSimulacao } from './useSimulacao';

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

const FileUploadArea: React.FC<{
  onFileSelect: () => void;
  preview: string | null;
  onChangeFile: () => void;
  onProcessImage: () => void;
  loading: boolean;
}> = ({ onFileSelect, preview, onChangeFile, onProcessImage, loading }) => (
  <Card sx={{ p: 4, mb: 4 }}>
    {!preview ? (
      <Box
        onClick={onFileSelect}
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
        <Box textAlign="center" mb={4}>
          <img src={preview} alt="Preview" style={{ maxWidth: 300, borderRadius: 8 }} />
        </Box>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" onClick={onChangeFile}>
            Escolher Outra Imagem
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onProcessImage}
            disabled={loading}
            startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <Palette size={16} />}
          >
            {loading ? 'Processando...' : 'Simular Cores'}
          </Button>
        </Box>
      </>
    )}
  </Card>
);

const ColorPalette: React.FC<{ results: ResultsType }> = ({ results }) => (
  <Card sx={{ p: 4, mb: 4 }}>
    <Typography variant="h6" mb={2}>Paleta de Cores Detectada</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <ColorCard color={results.cor_original} label="Cor Original" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ColorCard color={results.cores.analogas?.[0] ?? ''} label="Análoga 1" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ColorCard color={results.cores.analogas?.[1] ?? ''} label="Análoga 2" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ColorCard color={results.cores.complementar ?? ''} label="Complementar" />
      </Grid>
    </Grid>
  </Card>
);

const SimulationResults: React.FC<{
  results: ResultsType;
  onImageClick: (image: string) => void;
}> = ({ results, onImageClick }) => {
  const images = [
    { title: 'Original', src: results.images.original },
    { title: 'Análoga 1', src: results.images.analoga_1 },
    { title: 'Análoga 2', src: results.images.analoga_2 },
    { title: 'Complementar', src: results.images.complementar },
  ];

  return (
    <Card sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" mb={2}>Simulações</Typography>
      <Grid container spacing={2}>
        {images.map((img, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ImageResult
              src={img.src}
              title={img.title}
              onDownload={() => IAService.downloadImage(img.src, `${img.title.toLowerCase()}.jpg`)}
              onClickImage={() => onImageClick(img.src)}
            />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

const ImageModal: React.FC<{
  open: boolean;
  image: string | null;
  onClose: () => void;
}> = ({ open, image, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
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
      onClick={onClose}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'zoom-out',
      }}
    >
      {image && (
        <img
          src={image}
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
);

// Componente principal
const HairColorSimulator: React.FC = () => {
  const {
    preview,
    results,
    loading,
    error,
    modalOpen,
    modalImage,
    fileInputRef,
    handleFileSelect,
    processImage,
    handleImageClick,
    closeModal,
    openFileDialog,
    changeFile,
  } = useSimulacao();

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

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <FileUploadArea
        onFileSelect={openFileDialog}
        preview={results ? null : preview}
        onChangeFile={changeFile}
        onProcessImage={processImage}
        loading={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertCircle size={16} style={{ marginRight: 8 }} />
          {error}
        </Alert>
      )}

      {results && (
        <>
          <ColorPalette results={results} />
          <SimulationResults results={results} onImageClick={handleImageClick} />
        </>
      )}

      <ImageModal
        open={modalOpen}
        image={modalImage}
        onClose={closeModal}
      />
    </Box>
  );
};

export default HairColorSimulator;