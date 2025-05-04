import express from 'express';
import FuncionarioController from '../controllers/funcionarioController';

const router = express.Router();

router.get('/funcionario/page', FuncionarioController.getFuncionariosPage);
router.get('/funcionario/all', FuncionarioController.findAll);
router.get('/funcionario/ID/:id', FuncionarioController.findByID);
router.get('/funcionario/email/:email/:salaoId', FuncionarioController.findByEmailandSalao);
router.get('/funcionario/cpf/:cpf/:salaoId', FuncionarioController.findByCpfandSalao);
router.post('/funcionario', FuncionarioController.create);
router.put('/funcionario/update/:email/:salaoId', FuncionarioController.update);
router.delete('/funcionario/delete/:id', FuncionarioController.delete);

export default router;