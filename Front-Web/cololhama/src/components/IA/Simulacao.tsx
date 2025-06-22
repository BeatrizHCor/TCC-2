import React, { useRef, useContext } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { Palette, AlertCircle } from 'lucide-react';
import { useSimulacao } from './useSimulacao';
import { AuthContext } from '../../contexts/AuthContext';
import { FileUploadArea } from './FileUploadArea';
import { ColorPalette } from './colorPalette';
import { CarouselResults } from './carrosselResultados';
import { ImageModal } from './ImgModal';
import { SaveSimulationDialog } from './salvarSimulacaoDialog';
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
    showSaveDialog,
    saveLoading,
    saveSuccess,
    fileInputRef,
    handleFileSelect,
    processImage,
    handleImageClick,
    closeModal,
    openFileDialog,
    changeFile,
    handleSaveSimulation,
    closeSaveDialog,
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
          <Typography color="error.main" sx={{ mt: 2 }}>
            Usuário não logado
          </Typography>
        ) : (
          <Typography color="success.main" sx={{ mt: 2 }}>
            Logado como: {userType} (ID: {userId})
            {userType === 'Cliente' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Suas simulações serão salvas automaticamente no seu histórico
              </Typography>
            )}
          </Typography>
        )}
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

          {userType === 'Cliente' && saveSuccess && (
            <Alert
              severity="success"
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Simulação salva no seu histórico com sucesso!
            </Alert>
          )}
        </Box>
      )}

      {userType === 'Cliente' && results && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Deseja salvar essa simulação no seu histórico?
          </Typography>
          <button
            onClick={() => handleSaveSimulation(userId)}
            style={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Salvar Simulação
          </button>
        </Box>
      )}


      <ImageModal open={modalOpen} image={modalImage} onClose={closeModal} />

      <SaveSimulationDialog
        open={showSaveDialog}
        onClose={closeSaveDialog}
        onSave={handleSaveSimulation}
        loading={saveLoading}
        success={saveSuccess}
        error={error}
      />

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