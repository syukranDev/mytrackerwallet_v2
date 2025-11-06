module.exports = (sequelize, Sequelize) => {
    var Model = sequelize.define('users', {
      id: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      fullName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      password:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      profileImageUrl:{
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      createdAt:{
        type: Sequelize.DATE
      },
      updatedAt:{
        type: Sequelize.DATE
      },
    },{
      timestamps: true,
      underscored: true,
      freezeTableName: true
    });
    return Model;
  }