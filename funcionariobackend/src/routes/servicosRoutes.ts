import express from 'express';
import ServicoController from '../controllers/servicoController';

const router = express.Router();

router.get('/servico/page', ServicoController.getServicosPage);
router.get('/servico/all', ServicoController.findAll);
router.get('/servico/ID/:id', ServicoController.findByID);
router.get('/servico/salao/:salaoId', ServicoController.getServicosBySalao);
router.post('/servico', ServicoController.create);
router.put('/servico/update/:id', ServicoController.update);
router.delete('/servico/delete/:id', ServicoController.delete);
router.get('/servico/find/:nome/:salaoId', ServicoController.findServicoByNomeAndSalaoId);

export default router;