import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import theme from '../../styles/theme';
import ModalAdicionarFoto from './modalAdicionarFoto';

const fotosMock = new Array(6).fill(null);

const PortfolioCabeleireiro: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'adicionar' | 'editar'>('adicionar');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [fotos, setFotos] = useState<(string | null)[]>(fotosMock);

  const handleOpenAdicionar = () => {
    setModalMode('adicionar');
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEditFoto = (index: number) => {
    setModalMode('editar');
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSave = (image: string | null) => {
    if (modalMode === 'adicionar') {
      const newFotos = [...fotos];
      const emptyIndex = newFotos.findIndex(f => f === null);
      if (emptyIndex !== -1) {
        newFotos[emptyIndex] = image;
      }
      setFotos(newFotos);
    } else if (editingIndex !== null) {
      const newFotos = [...fotos];
      newFotos[editingIndex] = image;
      setFotos(newFotos);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (editingIndex !== null) {
      const newFotos = [...fotos];
      newFotos[editingIndex] = null;
      setFotos(newFotos);
      setModalOpen(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#e4e4e4' }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight="bold" fontFamily="serif">
            Cabeleireiro
          </Typography>

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: theme.palette.primary.main }}
              onClick={handleOpenAdicionar}
            >
              Adicionar Foto
            </Button>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.main }}>
              Salvar
            </Button>
          </Box>
        </Box>

        <Box display="flex" gap={4} mb={4} justifyContent="center">
          <Typography sx={{ maxWidth: 250, textAlign: 'center' }}>
            Descrição 1
          </Typography>
          <Typography sx={{ maxWidth: 300, textAlign: 'center' }}>
            Descrição 2
          </Typography>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center">
          {fotos.map((foto, index) => (
            <Box
              key={index}
              position="relative"
              width={200}
              height={200}
              bgcolor="#8c6b75"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundImage: foto ? `url(${foto})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&:hover .edit-button': { opacity: 1 },
              }}
            >
              <IconButton
                className="edit-button"
                onClick={() => handleEditFoto(index)}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Paper>

      <ModalAdicionarFoto
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        existingImage={editingIndex !== null ? fotos[editingIndex] : null}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default PortfolioCabeleireiro;
