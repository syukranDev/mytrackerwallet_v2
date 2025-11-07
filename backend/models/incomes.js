module.exports = (sequelize, Sequelize) => {
    var Model = sequelize.define('incomes', {
      userId:{
        type: Sequelize.TEXT,
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      source: {
        type: Sequelize.TEXT
      },
      created_at:{
        type: Sequelize.DATE
      },
      updated_at:{
        type: Sequelize.DATE
      },
    },{
      timestamps: true,
      underscored: true,
      freezeTableName: true
    });
    return Model;
  }