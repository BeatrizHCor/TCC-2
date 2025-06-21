import React, { useState, useMemo, useContext } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Chip,
  TablePagination,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import { Agendamentos } from '../../models/agendamentoModel';
import { StatusAgendamento } from '../../models/StatusAgendamento.enum';
import { useVisualizarAgendamentos } from './useVisualizarAgendamento';
import { AuthContext } from '../../contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7d1e26',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5f5f5',
    },
  },
});

const VisualizarAgendamento: React.FC = () => {
  const SalaoId = import.meta.env.VITE_SALAO_ID || '1';
  const { userType, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modoCalendario, setModoCalendario] = useState(true);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamentos | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataFilter, setDataFilter] = useState<Date | null>(null);

  const dia = dataFilter?.getDate() || 0;
  const mes = dataFilter?.getMonth() || 0;
  const ano = dataFilter?.getFullYear() || 0;

  const {
    agendamentos,
    totalAgendamentos,
    isLoading,
  } = useVisualizarAgendamentos(page + 1, rowsPerPage, SalaoId, modoCalendario, userType!, userId, dia, mes, ano);

  const handleVerDetalhes = (ag: Agendamentos) => {
    setAgendamentoSelecionado(ag);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setAgendamentoSelecionado(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const formatarDataHora = (data: Date): string =>
    new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.Agendado: return '#7d1e26'; // vermelho institucional
      case StatusAgendamento.Confirmado: return '#4caf50';
      case StatusAgendamento.Finalizado: return '#9c27b0';
      case StatusAgendamento.Cancelado: return '#f44336';
      default: return '#757575';
    }
  };

  const eventosCalendario = useMemo(() => {
    return agendamentos.map((ag) => ({
      title: ag.Cliente?.Nome || `Cliente ${ag.ClienteID}`,
      date: ag.Data,
      id: String(ag.ID),
      extendedProps: ag,
    }));
  }, [agendamentos]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" color="primary">Agendamentos</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/agendamento/novo')}>
              Novo Agendamento
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <DatePicker
              label="Filtrar por data"
              value={dataFilter}
              onChange={(date) => {
                setDataFilter(date);
                setPage(0);
              }}
              slotProps={{ textField: { size: 'small' } }}
            />
            <FormControlLabel
              control={<Switch checked={modoCalendario} onChange={() => setModoCalendario(!modoCalendario)} />}
              label={modoCalendario ? 'Modo Calendário' : 'Modo Lista'}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : modoCalendario ? (
            <Box sx={{ overflowX: 'auto' }}>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale="pt-br"
                events={eventosCalendario}
                height="auto"
                contentHeight="auto"
                dayMaxEventRows={3}
                eventClick={(info) => {
                  handleVerDetalhes(info.event.extendedProps as Agendamentos);
                }}
                dayCellClassNames={({ date }) =>
                  date.getMonth() !== new Date().getMonth() ? 'fc-other-month' : ''
                }
                dayCellContent={({ date }) => <span>{date.getDate()}</span>}
              />
              <style>{`
                .fc {
                  --fc-today-bg-color: #fdecea;
                  --fc-event-bg-color: #7d1e26;
                  --fc-event-text-color: white;
                }
                .fc-other-month {
                  opacity: 0.15 !important;
                  pointer-events: none;
                  background-color: #f5f5f5 !important;
                }
              `}</style>
            </Box>
          ) : (
            <>
              <List>
                {agendamentos.length > 0 ? (
                  agendamentos.map((ag) => (
                    <ListItem
                      key={ag.ID}
                      divider
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleVerDetalhes(ag)}>
                          <InfoIcon color="primary" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography fontWeight="bold" color="primary">
                            {ag.Cliente?.Nome || `Cliente ${ag.ClienteID}`}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">{formatarDataHora(ag.Data)}</Typography>
                            <Typography variant="body2">
                              Profissional: {ag.Cabeleireiro?.Nome || `ID: ${ag.CabeleireiroID}`}
                            </Typography>
                            <Chip
                              label={ag.Status}
                              size="small"
                              sx={{
                                mt: 1,
                                bgcolor: getStatusColor(ag.Status),
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            />
                          </>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography sx={{ px: 2 }}>Nenhum agendamento encontrado.</Typography>
                )}
              </List>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalAgendamentos}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </>
          )}

          <Dialog open={modalAberto} onClose={handleFecharModal} maxWidth="sm" fullWidth>
            {agendamentoSelecionado && (
              <>
                <DialogTitle>
                  Detalhes do Agendamento
                  <Chip
                    label={agendamentoSelecionado.Status}
                    size="small"
                    sx={{
                      ml: 2,
                      bgcolor: getStatusColor(agendamentoSelecionado.Status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </DialogTitle>
                <DialogContent dividers>
                  <Typography fontWeight="bold" sx={{ mt: 2 }}>Data e Hora</Typography>
                  <Typography>{formatarDataHora(agendamentoSelecionado.Data)}</Typography>

                  <Typography fontWeight="bold" sx={{ mt: 2 }}>Cliente</Typography>
                  <Typography>{agendamentoSelecionado.Cliente?.Nome || "Nome não encontrado"}</Typography>

                  <Typography fontWeight="bold" sx={{ mt: 2 }}>Profissional</Typography>
                  <Typography>{agendamentoSelecionado.Cabeleireiro?.Nome || "Nome não encontrado"}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleFecharModal}>Fechar</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/agendamento/editar/${agendamentoSelecionado.ID}`)}
                  >
                    Editar Agendamento
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default VisualizarAgendamento;