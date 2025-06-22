import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import theme from '../../styles/theme';

interface ColorCardProps {
  color: string;
  label: string;
}

export const ColorCard: React.FC<ColorCardProps> = ({ color, label }) => (
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