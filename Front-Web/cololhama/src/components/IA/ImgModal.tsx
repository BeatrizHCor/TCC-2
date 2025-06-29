import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box } from '@mui/material';
import { X } from 'lucide-react';

interface ImageModalProps {
  open: boolean;
  image: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ open, image, onClose }) => (
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