import express from 'express';
import ClienteController from '../controllers/clienteController';

const router = express.Router();

router.get('/', ClienteController.findAll);
router.get('/:cpf/:salaoId', ClienteController.findByCPFandSalao);
router.post('/', ClienteController.create);
router.put('/:cpf/:salaoId', ClienteController.update);
router.delete('/:cpf/:salaoId', ClienteController.delete);

export default router;