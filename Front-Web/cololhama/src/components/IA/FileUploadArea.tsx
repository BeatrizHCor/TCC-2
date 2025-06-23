import React from 'react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { CloudUpload, RotateCcw, Palette, Loader2 } from 'lucide-react';
import theme from '../../styles/theme';

interface FileUploadAreaProps {
  onFileSelect: () => void;
  preview: string | null;
  onChangeFile: () => void;
  onProcessImage: () => void;
  loading: boolean;
  hasResults: boolean;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  preview,
  onChangeFile,
  onProcessImage,
  loading,
  hasResults,
}) => {
  const showPreviewArea = !!preview || hasResults;

  return (
    <Paper
      elevation={2}
      sx={{
        p: showPreviewArea ? 2 : 4,
        mb: 4,
        borderRadius: 3,
        border: `2px dashed ${theme.palette.divider}`,
        backgroundColor: '#fafafa',
      }}
    >
      {!showPreviewArea ? (
        <Box
          onClick={onFileSelect}
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            py: 6,
            px: 4,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.light + '20',
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <CloudUpload size={64} color={theme.palette.primary.main} style={{ marginBottom: 24 }} />
          <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
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
          {preview && (
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
          )}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={onChangeFile}
              startIcon={<RotateCcw size={16} />}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
            >
              Trocar Imagem
            </Button>
            {!hasResults && (
              <Button
                variant="contained"
                onClick={onProcessImage}
                disabled={loading}
                startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <Palette size={16} />}
                sx={{ borderRadius: 2, px: 3, textTransform: 'none', minWidth: 160 }}
              >
                {loading ? 'Processando...' : 'Simular Cores'}
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};
