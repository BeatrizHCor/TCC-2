import express from 'express';
import ClienteController from '../controllers/clienteController';

const router = express.Router();

router.get('/page', ClienteController.getClientesPage);
router.get('/all', ClienteController.findAll);
//router.get('/id/:id', ClienteController.findByID.bind(ClienteController));
router.get('/:email/:salaoId', ClienteController.findByEmailandSalao);
router.post('/', ClienteController.create);
router.put('/:email/:salaoId', ClienteController.update);
router.delete('/:email/:salaoId', ClienteController.delete);

export default router;