import express from 'express';
import ClienteController from '../controllers/clienteController';

const router = express.Router();

router.get('/cliente/page', ClienteController.getClientesPage);
router.get('/cliente/all', ClienteController.findAll);
router.get('/cliente/:id/', ClienteController.findByID);
router.get('/cliente/:email/:salaoId', ClienteController.findByEmailandSalao);
router.get('/cliente/:cpf/:salaoId', ClienteController.findByCpfandSalao);
router.post('/cliente', ClienteController.create);
router.put('/cliente/update/:email/:salaoId', ClienteController.update);
router.delete('/cliente/delete/:email/:salaoId', ClienteController.delete);

export default router;