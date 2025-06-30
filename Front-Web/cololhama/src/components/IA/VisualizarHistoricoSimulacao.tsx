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
import { getImagemUrl } from '../../services/HistóricoSimulacaoService';
import { userTypes } from '../../models/tipo-usuario.enum';
import { ImageModal } from './ImgModal';

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

    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, simulacao: HistoricoSimulacao | null }>({ open: false, simulacao: null });
    const [viewDialog, setViewDialog] = useState<{ open: boolean, simulacao: HistoricoSimulacao | null }>({ open: false, simulacao: null });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    const handleImageClick = (url: string) => {
        setModalImage(url);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalImage(null);
    };

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
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
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
                <Grid container spacing={2}>
                    {historico.map((simulacao) => (
                        <Grid item xs={12} sm={6} md={4} key={simulacao.ID}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 3,
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                                onClick={() => handleViewClick(simulacao)}
                            >
                                <img
                                    src={
                                        simulacao.imagens && simulacao.imagens.length > 0
                                            ? getImagemUrl(simulacao.imagens[0].Endereco)
                                            : '/placeholder.jpg'
                                    }
                                    alt="Simulação"
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: '#fff',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                        }}
                                        onClick={() => handleViewClick(simulacao)}
                                    >
                                        <Eye size={16} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,0,0,0.5)',
                                            color: '#fff',
                                            '&:hover': { bgcolor: 'rgba(255,0,0,0.7)' },
                                        }}
                                        onClick={() => handleDeleteClick(simulacao)}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Box>

                                <Chip
                                    label={`${simulacao.imagens?.length || 0} imagens`}
                                    size="small"
                                    color="primary"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        left: 8,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        color: '#fff',
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        px: 1,
                                        borderRadius: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {format(new Date(simulacao.Data), 'dd/MM/yyyy')}
                                </Typography>
                            </Box>
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
                <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Visualização da Simulação
                </DialogTitle>

                <DialogContent>
                    {viewDialog.simulacao && (
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ mb: 3 }}
                            >
                                {format(new Date(viewDialog.simulacao.Data), 'dd/MM/yyyy HH:mm', {
                                    locale: ptBR,
                                })}
                            </Typography>

                            <Grid container spacing={2}>
                                {viewDialog.simulacao.imagens?.slice(0, 4).map((imagem, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={imagem.ID}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                overflow: 'hidden',
                                                borderRadius: 2,
                                                boxShadow: 3,
                                                transition: 'transform 0.3s',
                                                '&:hover img': {
                                                    transform: 'scale(1.05)',
                                                },
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleImageClick(getImagemUrl(imagem.Endereco))}
                                        >
                                            <img
                                                src={getImagemUrl(imagem.Endereco)}
                                                alt={imagem.Descricao}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    width: '100%',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: '#fff',
                                                    p: 1,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {imagem.Descricao}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadImage(
                                                            getImagemUrl(imagem.Endereco),
                                                            `simulacao_${index + 1}.jpg`
                                                        );
                                                    }}
                                                    sx={{ color: 'white' }}
                                                >
                                                    <Download size={16} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
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
                        Tem certeza que deseja excluir esta simulação? Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, simulacao: null })}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            <ImageModal open={modalOpen} image={modalImage} onClose={closeModal} />
        </Box>
    );
};

export default HistoricoSimulacoes;
