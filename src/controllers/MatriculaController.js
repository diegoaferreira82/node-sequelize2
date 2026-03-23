const Sequelize = require('sequelize');

const Controller = require('./Controller.js');
const MatriculaServices = require('../services/MatriculaServices.js');
const { where } = require('sequelize');

const matriculaServices = new MatriculaServices();

class MatriculaController extends Controller {
  constructor() {
    super(matriculaServices);
  }

  async pegaMatriculasPorEstudante(req, res) {
    const { estudante_id } = req.params;
    try {
      const listaMatriculasPorEstudante = await matriculaServices.pegaEContaRegistros({
        //abaixo estão os parâmetros que serão enviados ao services, parâmetros estes definidos na documentação ddo sequelize
        //é praticamente uma query SQL, mas usando a sintaxe do Sequelize
        where: {
          estudante_id: Number(estudante_id),
          status: 'matriculado'
        },
        limit: 2, //limita os registros por vez, pazendo uma paginação É uma opção do sequelize
        order: [['id', 'ASC']] //opção de ordenar os registros.
      });
      return res.status(200).json(listaMatriculasPorEstudante);  //pode ser .json(listaMatriculasPorEstudante.count) que retornará a quantidade APENAS, e se tirar retornará a quantidade E os registros.
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  //vamos ver quantas vezes o curso de ID==X aparece dentro de matrículas
  async pegaCursosLotados (req, res) {
    const lotacaoCurso = 2; //definindo a lotação máxima como 2 para teste, mas pode ser qualquer número
    try {
      const cursosLotados = await matriculaServices.pegaEContaRegistros({
        where: {
          status: 'matriculado'
        },
        attributes: ['curso_id'], //seleciona apenas a coluna curso_id para contar quantas vezes cada curso_id aparece
        group: ['curso_id'], //agrupa os registros por curso_id, ou seja, vai contar quantas matrículas existem para cada curso_id
        having: Sequelize.literal(`count(curso_id) >= ${lotacaoCurso}`) //filtra os grupos que têm a contagem de curso_id maior ou igual à lotação definida, ou seja, os cursos que estão lotados
        
      });
      return res.status(200).json(cursosLotados);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = MatriculaController;
