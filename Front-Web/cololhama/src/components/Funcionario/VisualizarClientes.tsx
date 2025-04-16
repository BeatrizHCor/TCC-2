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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Cliente } from '../../models/clienteModel';
import { useVisualizarClientes } from './useVisualizarClientes';
import "../../styles/styles.global.css";


const colunas = [
  { id: 'nome', label: 'Nome' },
  { id: 'email', label: 'Email' },
  { id: 'telefone', label: 'Telefone' },
  { id: 'dataCadastro', label: 'Data de Cadastro' },
];

export const VisualizarClientes: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [colunaBusca, setColunaBusca] = useState('nome');
  const [termoBusca, setTermoBusca] = useState('');

  const { 
    clientes, 
    totalClientes, 
    isLoading, 
    error 
  } = useVisualizarClientes(page + 1, rowsPerPage, '1');

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColunaBuscaChange = (event: any) => {
    setColunaBusca(event.target.value);
  };

  const handleTermoBuscaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(event.target.value);
    setPage(0);
  };
/*
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };
*/
  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar clientes: {error}</Box>;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, mr: 1 }}>
          <InputLabel id="coluna-busca-label">Buscar por</InputLabel>
          <Select
            labelId="coluna-busca-label"
            value={colunaBusca}
            onChange={handleColunaBuscaChange}
            label="Buscar por"
          >
            {colunas.map((coluna) => (
              <MenuItem key={coluna.id} value={coluna.id}>
                {coluna.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Buscar"
          value={termoBusca}
          onChange={handleTermoBuscaChange}
          fullWidth
        />
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente: Cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString('pt-BR') : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalClientes}
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
export default VisualizarClientes;