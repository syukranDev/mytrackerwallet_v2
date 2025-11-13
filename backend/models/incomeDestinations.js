module.exports = (sequelize, Sequelize) => {
    var Model = sequelize.define('income_destinations', {
      userId: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
    }, {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    });
    return Model;
  }

