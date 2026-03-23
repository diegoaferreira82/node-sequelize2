const Services = require('./Services.js');
const dataSource = require('../database/models');

class PessoaServices extends Services {
  constructor() {
    super('Pessoa');
    this.matriculaServices = new Services('Matricula');
  }

  async pegaMatriculasAtivasPorEstudante(id) {
    const estudante = await super.pegaUmRegistroPorId(id);
    const listaMatriculas = await estudante.getAulasMatriculadas();
    return listaMatriculas;
  }
  
  async pegaTodasAsMatriculasPorEstudante(id) {
    const estudante = await super.pegaUmRegistroPorId(id);
    const listaMatriculas = await estudante.getTodasAsMatriculas(); //pega o alias definido no model de pessoa, para pegar todas as matriculas, independente do status
    return listaMatriculas;
  }

  async pegaPessoasEscopoTodos() {
    const listaPessoas = await super.pegaRegistrosPorEscopo('todosOsRegistros');
    return listaPessoas;
  }


  //tem que englobar todo o método em uma Transaction, que vai garantir que todo ele seja executado caso dê algum erro no meio do caminho.

  async cancelaPessoaEMatriculas(estudanteId) {
    return dataSource.sequelize.transaction(async (transacao) => {
      await super.atualizaRegistro({ ativo: false }, { id: estudanteId }, transacao);
      await this.matriculaServices.atualizaRegistro({ status: 'cancelado' }, { estudante_id: estudanteId }, transacao);
    });
  }
}

module.exports = PessoaServices;
