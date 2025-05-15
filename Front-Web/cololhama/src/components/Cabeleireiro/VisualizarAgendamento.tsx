import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  CircularProgress, 
  Paper, 
  Chip,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InfoIcon from '@mui/icons-material/Info';
import { Agendamentos } from '../../models/agendamentoModel';
import { useVisualizarAgendamentos } from './useVisualizarAgendamento';
import { StatusAgendamento } from '../../models/StatusAgendamento.enum'

const VisualizarAgendamento: React.FC = () => {

  const SalaoId = import.meta.env.SALAO_ID || "1";
  
  const [modoCalendario, setModoCalendario] = useState<boolean>(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamentos | null>(null);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [dataFiltro, setDataFiltro] = useState<Date | null>(null);
  
  const getStatusColor = (status: StatusAgendamento): string => {
    switch (status) {
      case StatusAgendamento.Agendado:
        return '#4caf50'; // Verde
      case StatusAgendamento.Concluido:
        return '#9c27b0'; // Roxo
      case StatusAgendamento.Cancelado:
        return '#f44336'; // Vermelho
      default:
        return '#757575'; // Cinza
    }
  };

  const { 
    agendamentos, 
    loading, 
    totalAgendamentos, 
    paginaAtual, 
    setPaginaAtual,
    limitePorPagina,
    setLimitePorPagina
  } = useVisualizarAgendamentos(SalaoId, dataFiltro);


  const eventosCalendario = useMemo(() => {
    return agendamentos.map(agendamento => {
      const dataEvento = new Date(agendamento.Data);
      const clienteNome = agendamento.Cliente?.Nome || `Cliente ${agendamento.ClienteID}`;
      const cabeleireiroNome = agendamento.Cabeleireiro?.Nome || `Cabeleireiro ${agendamento.CabeleireiroID}`;
      
      return {
        id: agendamento.ID,
        title: `${clienteNome} - ${cabeleireiroNome}`,
        start: dataEvento,
        end: new Date(dataEvento.getTime() + 60 * 60000), // Duração padrão de 1 hora
        extendedProps: { agendamento },
        backgroundColor: getStatusColor(agendamento.Status),
      };
    });
  }, [agendamentos]);




  // Formatar data e hora
  const formatarDataHora = (data: Date): string => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const handleVerDetalhes = (agendamento: Agendamentos) => {
    setAgendamentoSelecionado(agendamento);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setAgendamentoSelecionado(null);
  };

  const handleEventClick = (info: any) => {
    const agendamento = info.event.extendedProps.agendamento;
    handleVerDetalhes(agendamento);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Agendamentos
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DatePicker
              label="Filtrar por data"
              value={dataFiltro}
              onChange={(novaData) => {
                setDataFiltro(novaData);
                setPaginaAtual(1); 
              }}
              slotProps={{ textField: { size: 'small' } }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={modoCalendario} 
                  onChange={() => setModoCalendario(!modoCalendario)} 
                  color="primary" 
                />
              }
              label={modoCalendario ? "Modo Calendário" : "Modo Lista"}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={2} sx={{ p: 2 }}>
            {modoCalendario ? (
              // Visualização de Calenwdário
              <Box sx={{ height: 600 }}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={eventosCalendario}
                  eventClick={handleEventClick}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  locale="pt-br"
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }}
                />
              </Box>
            ) : (
              // Visualização de Lista
              <List sx={{ width: '100%' }}>
                {agendamentos.length > 0 ? (
                  agendamentos.map((agendamento) => (
                    <ListItem 
                      key={agendamento.ID} 
                      divider
                      sx={{ 
                        borderLeft: `4px solid ${getStatusColor(agendamento.Status)}`,
                        my: 1,
                        borderRadius: 1,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {agendamento.Cliente?.Nome || `Cliente ${agendamento.ClienteID}`}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span" display="block">
                              {formatarDataHora(agendamento.Data)}
                            </Typography>
                            <Typography variant="body2" component="span" display="block">
                              Profissional: {agendamento.Cabeleireiro?.Nome || `ID: ${agendamento.CabeleireiroID}`}
                            </Typography>
                            <Chip 
                              label={agendamento.Status} 
                              size="small" 
                              sx={{ 
                                bgcolor: getStatusColor(agendamento.Status),
                                color: 'white',
                                mt: 1
                              }} 
                            />
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleVerDetalhes(agendamento)}>
                          <InfoIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    Nenhum agendamento encontrado para esta data.
                  </Typography>
                )}
              </List>
            )}
          </Paper>
        )}

        {/* Modal de Detalhes do Agendamento */}
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
                    color: 'white'
                  }} 
                />
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Data e Hora</Typography>
                    <Typography variant="body1">{formatarDataHora(agendamentoSelecionado.Data)}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Cliente</Typography>
                    <Typography variant="body1">
                      {agendamentoSelecionado.Cliente?.Nome || `ID: ${agendamentoSelecionado.ClienteID}`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Profissional</Typography>
                    <Typography variant="body1">
                      {agendamentoSelecionado.Cabeleireiro?.Nome || `ID: ${agendamentoSelecionado.CabeleireiroID}`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">ID do Agendamento</Typography>
                    <Typography variant="body1">{agendamentoSelecionado.ID || 'Não disponível'}</Typography>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleFecharModal} color="primary">
                  Fechar
                </Button>
                {/* Aqui você pode adicionar mais ações, como confirmar, cancelar, etc. */}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default VisualizarAgendamento;