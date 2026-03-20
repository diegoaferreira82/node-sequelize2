'use strict';
const isCpfValido = require('../../utils/validaCpfHelper.js');
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
        scope: { status: 'matriculado' },
        as: 'aulasMatriculadas'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        as: 'todasAsMatriculas'
      });
    }
  }

  //aqui podem ser colocadas validações próprias do Sequelize, como por exemplo, 
  // a validação de email, que garante que o valor inserido seja um endereço de email válido. 
  // Para isso, basta adicionar a propriedade 'validate' ao campo 'email' e definir a validação desejada.
  //  No exemplo abaixo, a validação 'isEmail' é utilizada para garantir que o valor inserido 
  //  um endereço de email válido, e uma mensagem personalizada é exibida caso a validação falhe.
  Pessoa.init({
    nome: {
      type:DataTypes.STRING,
      validate: {
        len: {
          args: [3, 30],
          msg: 'O nome deve conter entre 3 e 30 caracteres.'
          // a validação é fita no Sequelize e repassada ao ORM
          //diferentemente as Constraints(restrições) são feitas também no modelo ,porém deve estar no Banco do Ddados, 
          //e para implementá-la deve ser feita uma nova miração, com opção de AddConstraints
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true, 
          msg: 'O email deve ser um endereço de email válido.'
        }
      }
    },
    cpf: {
      type: DataTypes.STRING,
      validate: {
         cpfEhValido: (cpf) => {
          if (!isCpfValido(cpf)) throw new Error('CPF inválido');  // Expressão regular para validar o formato do CPF (XXX.XXX.XXX-XX)
        }
      }
    },
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