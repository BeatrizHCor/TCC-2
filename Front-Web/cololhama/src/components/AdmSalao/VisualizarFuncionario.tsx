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
} from '@mui/material';
import { Funcionario } from '../../models/funcionarioModel';
import { useVisualizarFuncionarios } from './useVisualizarFuncionario';
import "../../styles/styles.global.css";
const SalaoID = import.meta.env.SALAO_ID || "1"; // importa o ID do salão aqui

const colunas = [
  { id: 'nome', label: 'Nome' },
  { id: 'email', label: 'Email' },
  { id: 'telefone', label: 'Telefone' },
  { id: 'dataCadastro', label: 'Data de Cadastro' },
];

export const VisualizarFuncionarios: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nomeFilter, setNomeFilter] = useState("");

  const { 
    funcionarios, 
    totalFuncionarios, 
    isLoading, 
    error 
  } = useVisualizarFuncionarios(page + 1, rowsPerPage, nomeFilter, SalaoID);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const[NomeFiltroInput, setNomeFilterInput ]= useState("");
  const handleNomeFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeFilterInput(e.target.value);
  };
  const aplicarFiltroNome = () => {
    setNomeFilter(NomeFiltroInput);
    setPage(0);
  }


  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar funcionários: {error}</Box>;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', mb: 2 , gap: 2}}>
      <TextField
          variant="outlined"
          label="Buscar por nome"
          value={NomeFiltroInput} 
          onChange={handleNomeFilterInput}
          sx={{ maxWidth: "50%", flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={aplicarFiltroNome}
        >
          Buscar
        </Button>
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
              {funcionarios.map((funcionario: Funcionario) => (
                <TableRow key={funcionario.id}>
                  <TableCell>{funcionario.nome}</TableCell>
                  <TableCell>{funcionario.email}</TableCell>
                  <TableCell>{funcionario.telefone}</TableCell>
                  <TableCell>{funcionario.dataCadastro ? new Date(funcionario.dataCadastro).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>      
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalFuncionarios}
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
export default VisualizarFuncionarios;