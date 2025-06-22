import React from 'react';
import { Paper, Box, Typography, Grid } from '@mui/material';
import { Palette } from 'lucide-react';
import { ColorCard } from './colorCard';
import { ResultsType } from '../../services/IAService';
import theme from '../../styles/theme';

interface ColorPaletteProps {
  results: ResultsType;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ results }) => (
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