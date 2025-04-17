import React, { useState } from "react";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { Servico } from "../../models/servicoModel";
import { useVisualizarServicos } from "./useVisualizarServicos";
import "../../styles/styles.global.css";
import { Link } from "react-router-dom";
import theme from "../../styles/theme";

import { Link } from "react-router-dom";
import theme from "../../styles/theme";


const colunas = [
  { id: "nome", label: "Nome" },
  { id: "descricao", label: "Descrição" },
  { id: "precoMin", label: "Preço Mínimo" },
  { id: "precoMax", label: "Preço Máximo" },
  { id: "acoes", label: "Ações", clienteVisivel: false },
];

interface VisualizarServicosProps {
  salaoId: string;
  isCliente?: boolean;
  isAdmin?: boolean;
}

export const VisualizarServicos: React.FC<VisualizarServicosProps> = ({
  salaoId,
  isCliente = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nomeFilter, setNomeFilter] = useState("");
  const [nomeFilterInput, setNomeFilterInput] = useState(""); 
  const [nomeFilterInput, setNomeFilterInput] = useState(""); 
  const [precoMinFilter, setPrecoMinFilter] = useState<number | "">("");
  const [precoMaxFilter, setPrecoMaxFilter] = useState<number | "">("");

  const { servicos, totalServicos, isLoading, error, handleEditarServico } =
    useVisualizarServicos(
      page + 1,
      rowsPerPage,
      salaoId,
      nomeFilter,
      precoMinFilter,
      precoMaxFilter
    );
  const [precoMinInput, setPrecoMinInput] = React.useState(precoMinFilter); 

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [precoMaxInput, setPrecoMaxInput] = React.useState(precoMaxFilter);

  const handlePrecoMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setPrecoMaxInput(onlyNumbers === "" ? "" : Number(onlyNumbers));
    
  };
  
  const aplicarFiltroPrecoMax = () => {
    setPrecoMaxFilter(precoMaxInput);
  };
  

  const handlePrecoMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setPrecoMinInput(onlyNumbers === "" ? "" : Number(onlyNumbers));
  };
  
  const aplicarFiltroPreco = () => {
    setPrecoMinFilter(precoMinInput);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar serviços: {error}</Box>;

  const colunasVisiveis = isCliente
    ? colunas.filter((coluna) => coluna.clienteVisivel !== false)
    : colunas;

    

  console.log("Serviços:", servicos);
  console.log("Colunas visíveis:", colunasVisiveis);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Serviços do Salão
      </Typography>

      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <TextField
          variant="outlined"
          label="Buscar por nome"
          value={nomeFilterInput} 
          onChange={(event) => setNomeFilterInput(event.target.value)} 
          sx={{ maxWidth: "50%", flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setNomeFilter(nomeFilterInput); 
            setPage(0);
          }}
        >
          Buscar
        </Button>

        {!isCliente &&(
        <Button
          component={Link}
          variant="outlined"
          to = "/servico/editar/novo"
          sx={{
            color: theme.palette.primary.main,
            borderBlockColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          }}
        >
          Novo Serviço
        </Button>
        )}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <TextField
            variant="outlined"
            label="Preço mínimo"
            type="text" 
            value={precoMinInput}
            onChange={handlePrecoMinInputChange}
            sx={{ width: "150px" }}
            inputMode="numeric"
            slotProps={{
              input: {
              startAdornment: (<InputAdornment position="start">R$</InputAdornment>                
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={aplicarFiltroPreco}>
                    <CheckIcon />
                  </IconButton>
                </InputAdornment>
              ),
              }
            }}
          />
        
          <TextField
            variant="outlined"
            label="Preço máximo"
            type="text"
            value={precoMaxInput}
            onChange={handlePrecoMaxInputChange}
            sx={{ width: "150px" }}
            inputMode="numeric"
            slotProps={{
              input: {
                startAdornment: (<InputAdornment position="start">R$</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={aplicarFiltroPrecoMax}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),              
              }
            }}
          />
        </Box>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow key="header-row">
              <TableRow key="header-row">
                {colunasVisiveis.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colunasVisiveis.length} align="center">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
              ) : (
              servicos.map((servicos: Servico, index) => (
                <TableRow key={servicos.id ?? `row-${index}`}>
                  <TableCell>{servicos.nome || "—"} </TableCell>
                  <TableCell>{servicos.descricao || "—"}</TableCell>
                  <TableCell>
                    R${" "}
                    {servicos.precoMin !== undefined
                      ? servicos.precoMin.toFixed(2)
                    {servicos.precoMin !== undefined
                      ? servicos.precoMin.toFixed(2)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    R${" "}
                    {servicos.precoMax !== undefined
                      ? servicos.precoMax.toFixed(2)
                    {servicos.precoMax !== undefined
                      ? servicos.precoMax.toFixed(2)
                      : "N/A"}
                  </TableCell>
                  {!isCliente && (
                    <TableCell>
                      <Button
                        startIcon={<EditIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          servicos.id && handleEditarServico(servicos.id)
                          servicos.id && handleEditarServico(servicos.id)
                        }
                      >
                        Editar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              )))}
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
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>
    </Box>
  );
};

export default VisualizarServicos;
