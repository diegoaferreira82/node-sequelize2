'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Curso, {
        foreignKey: 'docente_id'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        // scope: { status: 'matriculado' },
        as: 'aulasMatriculadas'
      });
    }
  }
  Pessoa.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    cpf: DataTypes.STRING,
    ativo: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true, // Habilita o soft delete, adicionando a coluna 'deletedAt' e ignorando registros marcados como deletados nas consultas normais
    //deve também avisar o banco de dados para não excluir os registros, mas apenas marcar a coluna 'deletedAt' com a data da exclusão, para isso é necessário adicionar a opção 'paranoid: true' na definição do modelo e também no momento de criar as tabelas, utilizando a opção 'paranoid: true' no comando de migração. Com isso, quando um registro for deletado, ele não será removido fisicamente do banco de dados, mas sim marcado como deletado, permitindo que ele seja recuperado posteriormente se necessário.
    // deverá criar uma coluna na tabela do banco de dados
    defaultScope: {
      where: {
        ativo: true,
      }
    },
    scopes: {      
      todosOsRegistros: {
        where: {} // irá retornar todos os registros, incluindo os inativos, pois não há nenhuma condição de filtro aplicada
      }
    }
  });
  return Pessoa;
};