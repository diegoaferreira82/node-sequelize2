const { Op } = require('sequelize');

const Controller = require('./Controller.js');
const CursoServices = require('../services/CursoServices.js');

const cursoServices = new CursoServices();

class CursoController extends Controller {
  constructor() {
    super(cursoServices);
  }

  async pegaCursos(req, res) {
    const { data_inicial, data_final } = req.query; // Obtém as datas da query string que estará na URL após o ?
    const where = {};
    
    // const where = {
    //   data_inicio: {
    //     [Op.gte]: data_inicial, // Maior ou igual à data_inicial
    //     [Op.lte]: data_final // Menor ou igual à data_final
    //   }
    // }

    //se existirem os param que vem d URL, criar uma propriedade {}
    data_inicial || data_final ? where.data_inicio = {} : null;    // Se existir data_inicial ou data_final, adiciona a propriedade where ao objeto options
    //se existir data_inicial, adiciona a propriedade gte //greater than com o valor
    data_inicial ? where.data_inicio[Op.gte] = data_inicial : null; // Se existir data_inicial, adiciona a propriedade gte ao objeto where.data_inicio
    //se existir data_final, adiciona a propriedade lte //less than com o valor
    data_final ? where.data_inicio[Op.lte] = data_final : null; // Se existir data_final, adiciona a propriedade lte ao objeto where.data_inicio

    try {
      const listaCursos = await cursoServices.pegaTodosOsRegistros(where);
      return res.status(200).json(listaCursos);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
//para testar no Postman ==> localhost:3000/cursos?data_inicial-2023-01-01&data_final-2023-03-01

  
  }

}


module.exports = CursoController;
