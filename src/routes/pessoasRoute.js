const { Router } = require('express');
const PessoaController = require('../controllers/PessoaController.js');
const MatriculaController = require('../controllers/MatriculaController.js');

const pessoaController = new PessoaController();
const matriculaController = new MatriculaController();

const router = Router();

router.get('/pessoas', (req, res) => pessoaController.pegaTodos(req, res));
router.get('/pessoas/todos', (req, res) => pessoaController.pegaTodasAsPessoas(req, res));
router.get('/pessoas/:id', (req, res) => pessoaController.pegaUmPorId(req, res));
// Por exemplo, quando você define a rota /pessoas/:id antes da rota /pessoas/todos, o 
//  tenta casar a URL /pessoas/todos com a rota /pessoas/:id, interpretando "todos" como 
//  valor de id. Como "todos" não é um número, isso pode levar a erros como o que você viu 
// SQLITE_ERROR: no such column: NaN).
// Quando você coloca a rota /pessoas/todos antes da rota /pessoas/:id, o 
// Express primeiro verifica se a URL corresponde à rota mais específica (/pessoas/todos). 
//  não corresponder, ele então verifica a próxima rota (/pessoas/:id) que é mais genérica e pode casar 
// com qualquer valor após /pessoas/. Isso garante que a URL /pessoas/todos seja tratada corretamente pela rota 
// , evitando o erro de interpretação do parâmetro id como "todos".

router.post('/pessoas', (req, res) => pessoaController.criaNovo(req, res));
router.put('/pessoas/:id', (req, res) => pessoaController.atualiza(req, res));
router.delete('/pessoas/:id', (req, res) => pessoaController.exclui(req, res));
router.get('/pessoas/:estudante_id/matriculas', (req, res) => pessoaController.pegaMatriculasAtivas(req, res));
router.get('/pessoas/:estudante_id/matriculas/todos', (req, res) => pessoaController.pegaTodasAsMatriculas(req, res));
router.get('/pessoas/:estudante_id/matriculas/confirmadas', (req, res) => matriculaController.pegaMatriculasPorEstudante(req, res));
router.get('/pessoas/:estudante_id/matriculas/:id', (req, res) => pessoaController.pegaUm(req, res));
router.post('/pessoas/:estudante_id/matriculas', (req, res) => matriculaController.criaNovo(req, res));
router.put('/pessoas/:estudante_id/matriculas/:id', (req, res) => matriculaController.atualiza(req, res));
router.delete('/pessoas/:estudante_id/matriculas/:id', (req, res) => matriculaController.exclui(req, res));

module.exports = router;
