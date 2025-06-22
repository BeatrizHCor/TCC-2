// components/CarouselResults.tsx
import React from 'react';
import { Paper, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { Camera, Download, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResultsType, IAService } from '../../services/IAService';
import { useCarousel } from './useCarrosel'; 
import theme from '../../styles/theme';

interface CarouselResultsProps {
  results: ResultsType;
  onImageClick: (image: string) => void;
}

interface CarouselImage {
  title: string;
  src: string;
  isOriginal?: boolean;
  description: string;
}

export const CarouselResults: React.FC<CarouselResultsProps> = ({ results, onImageClick }) => {
  const images: CarouselImage[] = [
    { 
      title: 'Imagem Original', 
      src: results.images.original, 
      isOriginal: true, 
      description: 'Imagem original enviada por você.' 
    },
    { 
      title: 'Cor Análoga 1', 
      src: results.images.analoga_1, 
      description: 'Primeira sugestão de cor análoga (semelhante na roda de cores).' 
    },
    { 
      title: 'Cor Análoga 2', 
      src: results.images.analoga_2, 
      description: 'Segunda sugestão de cor análoga (semelhante na roda de cores).' 
    },
    { 
      title: 'Cor Complementar', 
      src: results.images.complementar, 
      description: 'Cor oposta na roda de cores, oferecendo contraste visual.' 
    },
  ];

  const {
    activeStep,
    handleNext,
    handleBack,
    handleDotClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useCarousel(images.length);

  const currentImage = images[activeStep];

  const handleDownload = () => {
    IAService.downloadImage(
      currentImage.src,
      `${currentImage.title.toLowerCase().replace(/\s+/g, '_')}.jpg`
    );
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
        {/* Carousel Container */}
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
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
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

          {/* Navigation Arrows */}
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
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
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
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                width: 40,
                height: 40,
                zIndex: 2,
              }}
            >
              <ChevronRight size={20} />
            </IconButton>
          )}

          {/* Dots Indicator */}
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

        {/* Image Info */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {currentImage.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.5 }}
          >
            {currentImage.description}
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

        {/* Download Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleDownload}
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
          Baixar {currentImage.title}
        </Button>

        {/* Thumbnails */}
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