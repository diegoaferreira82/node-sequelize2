# Requisitos do projeto

- O cliente não gostaria que registros importantes do sistema, como as Pessoas, sejam apagados definitivamente do banco de dados.
//Para satisfazer esse requisito, foi adicionada coluna deletedAt no banco em todas as tabelas, e o parametro
// paranoid:true em todos os modelos.
//Agora os registros não não deletados, são marcados como deletedAt com query UPDATE com a data
//e quando se faz consulta há um WHERE com updatedAt = NULL.

- Para deixar a interface mais limpa, o cliente gostaria que na lista de Pessoas, por padrão, fossem exibidos somente os usuários ativos.
//Para esse requisito foi adicionado nos models pessoas. Isso apenas FILTRA os resultados da consulta, mantendo os registros.
//    defaultScope: {
//      where: {
//        ativo: true,
//      }
//    },
//para contornar a falha do scopo padra exibir apenas os registros ativo=true, foi criada nova ROTA, nova função, novo, scopo, //
//com caminho /todos que mostra todos os registros.
//    scopes: {      
//      todosOsRegistros: {
//        where: {} // irá retornar todos os registros, incluindo os inativos, pois não há nenhuma condição de filtro aplicada
//      }
//    }


- Foram percebidas algumas falhas de validação dos formulários por parte do front-end, o que resultou em dados de email inválidos no banco. É desejável que essa validação não seja responsabilidade exclusiva do front.
<!-- Foi alterado no MODELS Pessoas a propriedade email para validação. O MODELS é quem possui 
todas as funções do Sequelize e a funçao de validação foi incluida:
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true, 
          msg: 'O email deve ser um endereço de email válido.'
        }
      }
    }, -->


- É importante poder consultar todas as matrículas confirmadas referentes a estudante X de forma rápida.

- O cliente gostaria de poder consultar as turmas abertas por intervalo de data, para não receber informações desnecessárias (como turmas antigas).

- O cliente quer poder consultar as matrículas por turma e saber quais delas estão lotadas, para organizar melhor as matrículas.

- O cliente gostaria que, uma vez que o cadastro de um estudante fosse desativado, todas as matrículas relativas a este estudante automaticamente passassem a constar como “canceladas”.