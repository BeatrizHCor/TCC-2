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
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../styles/theme';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import { Agendamentos } from '../../models/agendamentoModel';
import { StatusAgendamento } from '../../models/StatusAgendamento.enum';
import { useVisualizarAgendamentos } from './useVisualizarAgendamento';
import { AuthContext } from '../../contexts/AuthContext';

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

  const formatarHorario = (data: Date): string =>
    new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.Agendado: return '#7d1e26';
      case StatusAgendamento.Confirmado: return '#4caf50';
      case StatusAgendamento.Finalizado: return '#9c27b0';
      case StatusAgendamento.Cancelado: return '#f44336';
      default: return '#757575';
    }
  };

  const eventosCalendario = useMemo(() => {
    return agendamentos.map((ag) => ({
      title: `${ag.Cliente?.Nome || `Cliente ${ag.ClienteID}`}`,
      date: ag.Data,
      id: String(ag.ID),
      extendedProps: ag,
    }));
  }, [agendamentos]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: { xs: 'center', md: 'space-between' },
              alignItems: 'center',
              mb: 2,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              Agendamentos
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/agendamento/novo')}
            >
              Novo Agendamento
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'space-between' },
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
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
              control={
                <Switch checked={modoCalendario} onChange={() => setModoCalendario(!modoCalendario)} />
              }
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
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth',
                }}
                buttonText={{
                  today: 'Hoje',
                  month: 'Mês',
                }}
                dayHeaderClassNames={() => 'fc-day-header-custom'}
                dayCellClassNames={({ date, isPast, isToday, isOther }) => {
                  let classes = [];
                  if (isToday) classes.push('fc-day-today-custom');
                  if (isOther) classes.push('fc-day-other-month-custom');

                  const dateStr = date.toISOString().split('T')[0];
                  const hasEvents = agendamentos.some(ag => {
                    const agDate = new Date(ag.Data).toISOString().split('T')[0];
                    return agDate === dateStr;
                  });
                  if (hasEvents && !isToday) classes.push('fc-day-has-events');

                  return classes.join(' ');
                }}
                validRange={{
                  start: '1900-01-01',
                  end: '2099-12-31',
                }}
              />
              <style>{`
                .fc .fc-button {
                  background-color: ${theme.palette.primary.main} !important;
                  border-color: ${theme.palette.primary.main} !important;
                  color: white !important;
                }

                .fc .fc-button:hover,
                .fc .fc-button:focus,
                .fc .fc-button:active {
                  background-color: ${theme.palette.secondary.main} !important;
                  border-color: ${theme.palette.secondary.main} !important;
                }

                .fc .fc-toolbar-title {
                  color: ${theme.palette.primary.main};
                  font-weight: bold;
                  font-size: 1.4rem;
                }

                .fc .fc-daygrid-event {
                  background-color: ${theme.palette.primary.main};
                  color: white;
                  border-radius: 6px;
                  padding: 2px 4px;
                  font-size: 0.75rem;
                  font-weight: 500;
                }

                .fc .fc-day-has-events::before {
                  background-color: ${theme.palette.customColors?.goldenBorder};
                  box-shadow: 0 0 6px ${theme.palette.customColors?.goldenBorder};
                }

                .fc .fc-day-today-custom {
                  background-color: ${theme.palette.customColors?.lightGray} !important;
                }

                .fc .fc-day-header-custom {
                  background-color: ${theme.palette.primary.main};
                  color: white;
                  font-weight: bold;
                  padding: 8px 4px;
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
                component="div"
                count={totalAgendamentos}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Agendamentos por página"
                sx={{ mt: 2 }}
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
                    sx={{ ml: 2, bgcolor: getStatusColor(agendamentoSelecionado.Status), color: 'white', fontWeight: 'bold' }}
                  />
                </DialogTitle>
                <DialogContent dividers>
                  <Typography fontWeight="bold" sx={{ mt: 2 }}>
                    Data e Hora
                  </Typography>
                  <Typography>{formatarDataHora(agendamentoSelecionado.Data)}</Typography>
                  <Typography fontWeight="bold" sx={{ mt: 2 }}>
                    Cliente
                  </Typography>
                  <Typography>{agendamentoSelecionado.Cliente?.Nome || 'Nome não encontrado'}</Typography>
                  <Typography fontWeight="bold" sx={{ mt: 2 }}>
                    Profissional
                  </Typography>
                  <Typography>{agendamentoSelecionado.Cabeleireiro?.Nome || 'Nome não encontrado'}</Typography>
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
