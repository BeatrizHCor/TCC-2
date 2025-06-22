import React, { useRef, useContext } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { Palette, AlertCircle } from 'lucide-react';
import { useSimulacao } from './useSimulacao';
import { AuthContext } from '../../contexts/AuthContext';
import { FileUploadArea } from './FileUploadArea';
import { ColorPalette } from './colorPalette';
import { CarouselResults } from './carrosselResultados';
import { ImageModal } from './ImgModal';
import theme from '../../styles/theme';

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
      {/* Header */}
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
        
        {/* Debug Info - Remover em produção */}
        {!userId ? (
          <Typography color="error.main" sx={{ mt: 2 }}>
            Usuário não logado
          </Typography>
        ) : (
          <Typography color="success.main" sx={{ mt: 2 }}>
            Logado como: {userType} (ID: {userId})
          </Typography>
        )}
      </Paper>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* File Upload Area */}
      <FileUploadArea
        onFileSelect={openFileDialog}
        preview={results ? null : preview}
        onChangeFile={changeFile}
        onProcessImage={processImage}
        loading={loading}
        hasResults={!!results}
      />

      {/* Error Alert */}
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

      {/* Results */}
      {results && (
        <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
          <ColorPalette results={results} />
          <CarouselResults results={results} onImageClick={handleImageClick} />
        </Box>
      )}

      {/* Image Modal */}
      <ImageModal open={modalOpen} image={modalImage} onClose={closeModal} />

      {/* Global Styles */}
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