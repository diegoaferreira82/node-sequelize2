//O services contem as funções chamadas, e dentro dessas funções
//tem as funções próprias do Sequelize.


const dataSource = require('../database/models');

class Services {
  constructor(nomeDoModel) {
    this.model = nomeDoModel;
  }

  async pegaTodosOsRegistros (where = {}) {
    return dataSource[this.model].findAll({ where : { ...where}});
  }

  async pegaRegistrosPorEscopo (escopo) {
    return dataSource[this.model].scope(escopo).findAll();
  }

  async pegaUmRegistroPorId(id) {
    return dataSource[this.model].findByPk(id);
  }
  
  async pegaUmRegistro(where) {
    return dataSource[this.model].findOne({ where : { ...where}});
  } //o where é um objeto, e o operador spread é para pegar as chaves e os valores do objeto e colocar dentro do where do Sequelize
  //o where serve para fazer consultas mais específicas, como por exemplo, pegar um registro por email, ou por nome, etc. Ele é um objeto que pode conter várias chaves e valores, e o Sequelize vai usar essas chaves e valores para fazer a consulta no banco de dados.
  //ESTUDAR MAIS O WHERE!!

  async pegaEContaRegistros(where) {
    return dataSource[this.model].findAndCountAll({ where : { ...where}});
  }

  //na criação de novo registro de matricula, a validação de chave estrangeira está sendo feita pelo Sequelize e não pela aplicação
  async criaRegistro(dadosDoRegistro) {
    return dataSource[this.model].create(dadosDoRegistro);
  }

  async atualizaRegistro(dadosAtualizados, where) {
    const listadeRegistrosAtualizados = await dataSource[this.model].update(dadosAtualizados, {
      where: { ...where }
    });
    if (listadeRegistrosAtualizados[0] === 0) {
      return false;
    }
    return true;
  }

  //agora, com o PARANOID, ele não apaga mas faz um queru com UPDATE para colocar a coluna deletedAt com a data atual, ou seja, ele marca como deletado mas não apaga de fato do banco de dados
  async excluiRegistro(id) {
    return dataSource[this.model].destroy({ where: { id: id } });
  }
}

module.exports = Services;
