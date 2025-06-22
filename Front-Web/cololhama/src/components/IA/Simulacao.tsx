import React, { useRef, useState, ChangeEvent, useContext } from 'react';
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
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Paper,
  Stack,
  MobileStepper,
  useTheme,
} from '@mui/material';
import {
  Download,
  Palette,
  Camera,
  AlertCircle,
  Loader2,
  X,
  CloudUpload,
  RotateCcw,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { IAService, ResultsType } from '../../services/IAService';
import { useSimulacao } from './useSimulacao';
import { AuthContext } from '../../contexts/AuthContext';
import theme from '../../styles/theme';

const ColorCard: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <Card 
    elevation={2}
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 2.5,
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
      }
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: color,
        border: '3px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        mr: 2,
      }}
      />
    <Box>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" fontFamily="monospace">
        {color}
      </Typography>
    </Box>
  </Card>
);

const ImageResult: React.FC<{
  src: string;
  title: string;
  onDownload: () => void;
  onClickImage: () => void;
  isOriginal?: boolean;
}> = ({ src, title, onDownload, onClickImage, isOriginal = false }) => (
  <Card
  elevation={3}
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: isOriginal ? `2px solid ${theme.palette.primary.main}` : 'none',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
      }
    }}
    >
    <Box sx={{ position: 'relative' }}>
      <CardMedia
        component="img"
        height="220"
        image={src}
        alt={title}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          objectFit: 'cover',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }}
        onClick={onClickImage}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,1)',
          }
        }}
        size="small"
        onClick={onClickImage}
      >
        <ZoomIn size={16} />
      </IconButton>
      {isOriginal && (
        <Chip
          label="Original"
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontWeight: 600,
          }}
        />
      )}
    </Box>
    <CardContent sx={{ p: 2.5 }}>
      <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
        {title}
      </Typography>
      <Button
        fullWidth
        variant="contained"
        onClick={onDownload}
        startIcon={<Download size={16} />}
        sx={{
          borderRadius: 2,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
        }}
      >
        Baixar Imagem
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
  hasResults: boolean;
}> = ({ onFileSelect, preview, onChangeFile, onProcessImage, loading, hasResults }) => (
  <Paper
    elevation={2}
    sx={{
      p: hasResults ? 2 : 4,
      mb: 4,
      borderRadius: 3,
      border: `2px dashed ${theme.palette.divider}`,
      backgroundColor: '#fafafa',
    }}
  >
    {!preview ? (
      <Box
        onClick={onFileSelect}
        sx={{
          textAlign: 'center',
          cursor: 'pointer',
          py: hasResults ? 3 : 6,
          px: 4,
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.light + '20',
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <CloudUpload
          size={hasResults ? 48 : 64}
          color={theme.palette.primary.main}
          style={{ marginBottom: hasResults ? 16 : 24 }}
        />
        <Typography variant={hasResults ? "body1" : "h6"} gutterBottom fontWeight={600} color="text.primary">
          Selecione uma foto para começar
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Clique aqui ou arraste e solte uma imagem
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Formatos aceitos: JPG, PNG • Tamanho máximo: 10MB
        </Typography>
      </Box>
    ) : (
      <Box textAlign="center">
        <Box
          sx={{
            display: 'inline-block',
            p: 1,
            borderRadius: 2,
            backgroundColor: '#fff',
            boxShadow: theme.shadows[3],
            mb: 3,
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: hasResults ? 240 : 320,
              maxHeight: hasResults ? 240 : 320,
              borderRadius: 8,
              display: 'block',
            }}
          />
        </Box>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={onChangeFile}
            startIcon={<RotateCcw size={16} />}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
            }}
          >
            Trocar Imagem
          </Button>

          <Button
            variant="contained"
            onClick={onProcessImage}
            disabled={loading}
            startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <Palette size={16} />}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              minWidth: 160,
            }}
          >
            {loading ? 'Processando...' : 'Simular Cores'}
          </Button>
        </Stack>
      </Box>
    )}
  </Paper>
);

const ColorPalette: React.FC<{ results: ResultsType }> = ({ results }) => (
  <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        fontWeight={600}
        color={theme.palette.primary.main}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Palette size={24} />
        Paleta de Cores Detectada
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Cores extraídas automaticamente da sua imagem
      </Typography>
    </Box>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <ColorCard color={results.cor_original} label="Cor Original" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ColorCard color={results.cores.analogas?.[0] ?? ''} label="Análoga 1" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ColorCard color={results.cores.analogas?.[1] ?? ''} label="Análoga 2" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ColorCard color={results.cores.complementar ?? ''} label="Complementar" />
      </Grid>
    </Grid>
  </Paper>
);

const CarouselResults: React.FC<{
  results: ResultsType;
  onImageClick: (image: string) => void;
}> = ({ results, onImageClick }) => {
  const images = [
    { title: 'Imagem Original', src: results.images.original, isOriginal: true, description: 'Imagem original enviada por você.' },
    { title: 'Cor Análoga 1', src: results.images.analoga_1, description: 'Primeira sugestão de cor análoga (semelhante na roda de cores).' },
    { title: 'Cor Análoga 2', src: results.images.analoga_2, description: 'Segunda sugestão de cor análoga (semelhante na roda de cores).' },
    { title: 'Cor Complementar', src: results.images.complementar, description: 'Cor oposta na roda de cores, oferecendo contraste visual.' },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeStep < images.length - 1) {
      handleNext();
    }
    if (isRightSwipe && activeStep > 0) {
      handleBack();
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, images.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleDotClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3, overflow: 'hidden' }}>
      <Typography
        variant="h5"
        gutterBottom
        fontWeight={600}
        color={theme.palette.primary.main}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}
      >
        <Camera size={24} />
        Resultados da Simulação
      </Typography>

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, mx: 'auto' }}>

        <Box
          sx={{
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#000',
            aspectRatio: '4/5',
            mb: 3,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Box
            sx={{
              display: 'flex',
              width: `${images.length * 100}%`,
              height: '100%',
              transform: `translateX(-${(activeStep * 100) / images.length}%)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: `${100 / images.length}%`,
                  height: '100%',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  onClick={() => onImageClick(image.src)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                />

                {image.isOriginal && (
                  <Chip
                    label="Original"
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      color: theme.palette.primary.main,
                    }}
                  />
                )}

                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    },
                    width: 36,
                    height: 36,
                  }}
                  size="small"
                  onClick={() => onImageClick(image.src)}
                >
                  <ZoomIn size={16} />
                </IconButton>
              </Box>
            ))}
          </Box>

          {activeStep > 0 && (
            <IconButton
              onClick={handleBack}
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
                width: 40,
                height: 40,
                zIndex: 2,
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>
          )}

          {activeStep < images.length - 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
                width: 40,
                height: 40,
                zIndex: 2,
              }}
            >
              <ChevronRight size={20} />
            </IconButton>
          )}

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 2,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === activeStep
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    transform: 'scale(1.2)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {images[activeStep].title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.5 }}
          >
            {images[activeStep].description}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              backgroundColor: 'rgba(0,0,0,0.05)',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              display: 'inline-block',
            }}
          >
            {activeStep + 1} de {images.length}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={() => IAService.downloadImage(
            images[activeStep].src,
            `${images[activeStep].title.toLowerCase().replace(/\s+/g, '_')}.jpg`
          )}
          startIcon={<Download size={18} />}
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Baixar {images[activeStep].title}
        </Button>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            mt: 3,
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                border: index === activeStep
                  ? `3px solid ${theme.palette.primary.main}`
                  : '3px solid transparent',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                '&:hover': {
                  transform: 'scale(1.05)',
                  opacity: 0.8,
                },
                opacity: index === activeStep ? 1 : 0.6,
              }}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${image.title}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
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
    maxWidth={false}
    fullScreen
    BackdropProps={{
      style: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
    }}
    PaperProps={{
      sx: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        boxShadow: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      },
    }}
  >
    <DialogTitle sx={{
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pb: 1,
      flexShrink: 0,
    }}>
      <Typography variant="h6" color="inherit">
        Visualização Ampliada
      </Typography>
      <IconButton onClick={onClose} sx={{ color: '#fff' }}>
        <X />
      </IconButton>
    </DialogTitle>
    <DialogContent
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      {image && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={image}
            alt="Visualização Ampliada"
            style={{
              maxWidth: '95%',
              maxHeight: '95%',
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          />
        </Box>
      )}
    </DialogContent>
  </Dialog>
);

const HairColorSimulator: React.FC = () => {

  const { userType, userId } = useContext(AuthContext);
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
  } = useSimulacao(userId, userType!);

  return (
    <Box sx={{
      maxWidth: 1400,
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#fafafa',
    }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={700}
          gutterBottom
          color={theme.palette.primary.main}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Palette size={40} />
          Simulador de Cor de Cabelo
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Descubra como ficaria com diferentes cores de cabelo usando inteligência artificial

        </Typography>
        {!userId ? (
          <Typography> Não LOGADO</Typography>
        ) : <Typography>           
          Esta logado: {userType}
          User ID: {userId}</Typography>
        }

      </Paper>

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
        hasResults={!!results}
      />

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              alignItems: 'center',
            },
          }}
          icon={<AlertCircle size={20} />}
        >
          <Typography variant="body1" fontWeight={500}>
            {error}
          </Typography>
        </Alert>
      )}

      {results && (
        <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
          <ColorPalette results={results} />
          <CarouselResults results={results} onImageClick={handleImageClick} />
        </Box>
      )}

      <ImageModal open={modalOpen} image={modalImage} onClose={closeModal} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default HairColorSimulator;