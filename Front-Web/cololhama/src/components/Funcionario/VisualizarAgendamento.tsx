import React, { useState, useMemo } from 'react';
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
import { Agendamentos } from '../../models/agendamentoModel';
import { useVisualizarAgendamentos } from './useVisualizarAgendamento';
import { StatusAgendamento } from '../../models/StatusAgendamento.enum';
import { useNavigate } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const VisualizarAgendamento: React.FC = () => {
  const SalaoId = import.meta.env.VITE_SALAO_ID || '1';
  const navigate = useNavigate();

  const [modoCalendario, setModoCalendario] = useState(true);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamentos | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataFilter, setDataFilter] = useState<Date | null>(null);

  const diaFilter = dataFilter?.getDate() || 0;
  const mesFilter = dataFilter?.getMonth() || 0;
  const anoFilter = dataFilter?.getFullYear() || 0;

  const {
    agendamentos,
    loading,
    totalAgendamentos,
  } = useVisualizarAgendamentos(page + 1, rowsPerPage, SalaoId, diaFilter, mesFilter, anoFilter);

  const formatarDataHora = (data: Date) =>
    new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleVerDetalhes = (ag: Agendamentos) => {
    setAgendamentoSelecionado(ag);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setAgendamentoSelecionado(null);
  };

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
          <Typography variant="h4" component="h1" margin={2}>
            Agendamentos
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, flexWrap: 'wrap' }}>
            <DatePicker
              label="Filtrar data"
              value={dataFilter}
              onChange={(d) => {
                setDataFilter(d);
                setPage(0);
              }}
              slotProps={{ textField: { size: 'small' } }}
            />

            <FormControlLabel
              control={<Switch checked={modoCalendario} onChange={() => setModoCalendario(!modoCalendario)} color="primary" />}
              label={modoCalendario ? 'Modo Calendário' : 'Modo Lista'}
              sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
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
                  const agendamento = info.event.extendedProps as Agendamentos;
                  handleVerDetalhes(agendamento);
                }}
                dayCellClassNames={({ date, view }) => {
                  const currentMonth = new Date().getMonth();
                  return date.getMonth() !== currentMonth ? 'fc-other-month' : '';
                }}
                dayCellContent={({ date }) => (
                  <span>{date.getDate()}</span>
                )}
                dayHeaderFormat={{ weekday: 'short' }}
              />
              <style>
                {`
                  .fc-other-month {
                    opacity: 0.1 !important;
                    pointer-events: none;
                  }
                `}
              </style>
            </Box>
          ) : (
            <>
              <List sx={{ width: '100%' }}>
                {agendamentos.length > 0 ? (
                  agendamentos.map((ag) => (
                    <ListItem key={ag.ID} divider secondaryAction={
                      <IconButton edge="end" onClick={() => handleVerDetalhes(ag)}>
                        <InfoIcon />
                      </IconButton>
                    }>
                      <ListItemText
                        disableTypography
                        primary={<Typography variant="subtitle1" fontWeight="bold">{ag.Cliente?.Nome || `Cliente ${ag.ClienteID}`}</Typography>}
                        secondary={
                          <Box>
                            <Typography variant="body2" display="block">{formatarDataHora(ag.Data)}</Typography>
                            <Typography variant="body2" display="block">
                              Profissional: {ag.Cabeleireiro?.Nome || `ID: ${ag.CabeleireiroID}`}
                            </Typography>
                            <Chip label={ag.Status} size="small" sx={{ bgcolor: getStatusColor(ag.Status), color: 'white', mt: 1 }} />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ px: 2 }}>
                    Nenhum agendamento encontrado.
                  </Typography>
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
                  <Chip label={agendamentoSelecionado.Status} size="small" sx={{
                    ml: 2,
                    bgcolor: getStatusColor(agendamentoSelecionado.Status),
                    color: 'white',
                  }} />
                </DialogTitle>

                <DialogContent dividers>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Data e Hora</Typography>
                    <Typography variant="body1">{formatarDataHora(agendamentoSelecionado.Data)}</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Cliente</Typography>
                    <Typography variant="body1">{agendamentoSelecionado.Cliente?.Nome || `ID: ${agendamentoSelecionado.ClienteID}`}</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Profissional</Typography>
                    <Typography variant="body1">{agendamentoSelecionado.Cabeleireiro?.Nome || `ID: ${agendamentoSelecionado.CabeleireiroID}`}</Typography>
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleFecharModal}>Fechar</Button>
                  <Button variant="contained" color="primary" onClick={() => navigate(`/agendamento/${agendamentoSelecionado.ID}`)}>
                    Ir para página do agendamento
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
