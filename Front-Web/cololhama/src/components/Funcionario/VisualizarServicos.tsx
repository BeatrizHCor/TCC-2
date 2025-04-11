import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Servico } from '../../models/servicoModel';
import { useVisualizarServicos } from './useVisualizarServicos';
import "../../styles/styles.global.css";

const colunas = [
  { id: 'nome', label: 'Nome' },
  { id: 'descricao', label: 'Descrição' },
  { id: 'precoMin', label: 'Preço Mínimo' },
  { id: 'precoMax', label: 'Preço Máximo' },
  { id: 'acoes', label: 'Ações', clienteVisivel: false }
];

interface VisualizarServicosProps {
  salaoId: string;
  isCliente?: boolean;
}

export const VisualizarServicos: React.FC<VisualizarServicosProps> = ({ salaoId, isCliente = false }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nomeFilter, setNomeFilter] = useState('');
  const [precoMinFilter, setPrecoMinFilter] = useState<number | ''>('');
  const [precoMaxFilter, setPrecoMaxFilter] = useState<number | ''>('');

  const { 
    servicos, 
    totalServicos, 
    isLoading, 
    error,
    handleEditarServico
  } = useVisualizarServicos(page + 1, rowsPerPage, salaoId, nomeFilter, precoMinFilter, precoMaxFilter);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNomeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNomeFilter(event.target.value);
    setPage(0);
  };

  const handlePrecoMinFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    setPrecoMinFilter(value);
    setPage(0);
  };

  const handlePrecoMaxFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    setPrecoMaxFilter(value);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar serviços: {error}</Box>;

  const colunasVisiveis = isCliente 
    ? colunas.filter(coluna => coluna.clienteVisivel !== false)
    : colunas;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Serviços do Salão
      </Typography>

      <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
        <TextField
          variant="outlined"
          label="Buscar por nome"
          value={nomeFilter}
          onChange={handleNomeFilterChange}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Preço mínimo"
          type="number"
          value={precoMinFilter}
          onChange={handlePrecoMinFilterChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          sx={{ width: '180px' }}
        />
        <TextField
          variant="outlined"
          label="Preço máximo"
          type="number"
          value={precoMaxFilter}
          onChange={handlePrecoMaxFilterChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          sx={{ width: '180px' }}
        />
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {colunasVisiveis.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos.map((servico: Servico) => (
                <TableRow key={servico.id}>
                  <TableCell>{servico.nome}</TableCell>
                  <TableCell>{servico.descricao}</TableCell>
                  <TableCell>R$ {servico.precoMin !== undefined ? servico.precoMin.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell>R$ {servico.precoMax !== undefined ? servico.precoMax.toFixed(2) : 'N/A'}</TableCell>
                  {!isCliente && (
                    <TableCell>
                      <Button 
                        startIcon={<EditIcon />} 
                        variant="outlined" 
                        size="small"
                        onClick={() => servico.id && handleEditarServico(servico.id)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalServicos}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default VisualizarServicos;