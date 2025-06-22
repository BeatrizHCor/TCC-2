import React, { useEffect, useContext, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    History,
    Calendar,
    MapPin,
    Trash2,
    Eye,
    Download
} from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistorico } from './useHistorico';
import { HistoricoSimulacao } from '../../services/HistóricoSimulacaoService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { userTypes } from '../../models/tipo-usuario.enum';

const HistoricoSimulacoes: React.FC = () => {
    const { userType, userId } = useContext(AuthContext);
    const {
        historico,
        loading,
        error,
        loadHistoricoCliente,
        loadHistoricoSalao,
        deleteSimulation,
        clearError,
    } = useHistorico();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        simulacao: HistoricoSimulacao | null;
    }>({ open: false, simulacao: null });

    const [viewDialog, setViewDialog] = useState<{
        open: boolean;
        simulacao: HistoricoSimulacao | null;
    }>({ open: false, simulacao: null });

    useEffect(() => {
        if (userId) {
            if (userType === 'Cliente') {
                loadHistoricoCliente(userId);
            } else if (userType === userTypes.AdmSalao) {
                loadHistoricoSalao(userId);
            }
        }
    }, [userId, userType, loadHistoricoCliente, loadHistoricoSalao]);

    const handleDeleteClick = (simulacao: HistoricoSimulacao) => {
        setDeleteDialog({ open: true, simulacao });
    };

    const handleConfirmDelete = async () => {
        if (deleteDialog.simulacao) {
            const success = await deleteSimulation(deleteDialog.simulacao.ID);
            if (success) {
                setDeleteDialog({ open: false, simulacao: null });
            }
        }
    };

    const handleViewClick = (simulacao: HistoricoSimulacao) => {
        setViewDialog({ open: true, simulacao });
    };

    const handleDownloadImage = (imageUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!userId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error">
                    Você precisa estar logado para ver o histórico
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
                <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                    <History size={32} />
                    <Typography variant="h4" fontWeight={700}>
                        Histórico de Simulações
                    </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">
                    {userType === 'Cliente'
                        ? 'Suas simulações de cores de cabelo'
                        : 'Simulações realizadas no seu salão'}
                </Typography>
            </Paper>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={clearError}
                >
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Carregando histórico...</Typography>
                </Box>
            ) : historico.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Nenhuma simulação encontrada
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {userType === 'Cliente'
                            ? 'Faça sua primeira simulação para ver o histórico aqui'
                            : 'Ainda não há simulações realizadas no seu salão'}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {historico.map((simulacao) => (
                        <Grid item xs={12} sm={6} md={4} key={simulacao.ID}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {simulacao.imagens && simulacao.imagens.length > 0 && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={simulacao.imagens[0].Endereco}
                                        alt="Simulação"
                                        sx={{ objectFit: 'cover' }}
                                    />
                                )}

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Calendar size={16} />
                                        <Typography variant="body2" color="text.secondary">
                                            {format(new Date(simulacao.Data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                        </Typography>
                                    </Box>

                                    {typeof simulacao.ClienteID === 'object' && 'Nome' in simulacao.ClienteID && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Cliente: {simulacao.ClienteID.Nome}
                                        </Typography>
                                    )}

                                    {typeof simulacao.SalaoId === 'object' && 'Nome' in simulacao.SalaoId && (
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <MapPin size={16} />
                                            <Typography variant="body2" color="text.secondary">
                                                {simulacao.SalaoId.Nome}
                                            </Typography>
                                        </Box>
                                    )}


                                    <Chip
                                        label={`${simulacao.imagens?.length || 0} imagens`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </CardContent>

                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Box display="flex" justifyContent="space-between">
                                        <IconButton
                                            onClick={() => handleViewClick(simulacao)}
                                            color="primary"
                                            size="small"
                                        >
                                            <Eye size={18} />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDeleteClick(simulacao)}
                                            color="error"
                                            size="small"
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog
                open={viewDialog.open}
                onClose={() => setViewDialog({ open: false, simulacao: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Detalhes da Simulação
                </DialogTitle>
                <DialogContent>
                    {viewDialog.simulacao && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {format(new Date(viewDialog.simulacao.Data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </Typography>

                            <Grid container spacing={2}>
                                {viewDialog.simulacao.imagens?.map((imagem, index) => (
                                    <Grid item xs={6} sm={3} key={imagem.ID}>
                                        <Box>
                                            <img
                                                src={imagem.Endereco}
                                                alt={imagem.Descricao}
                                                style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: 8
                                                }}
                                            />
                                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                {imagem.Descricao}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDownloadImage(
                                                    imagem.Endereco,
                                                    `simulacao_${index + 1}.jpg`
                                                )}
                                            >
                                                <Download size={16} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialog({ open: false, simulacao: null })}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, simulacao: null })}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <Typography>
                        Tem certeza que deseja excluir esta simulação?
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, simulacao: null })}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HistoricoSimulacoes;