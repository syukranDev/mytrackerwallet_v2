module.exports = (sequelize, Sequelize) => {
  var Model = sequelize.define('expenses', {
    userId:{
      type: Sequelize.TEXT,
      allowNull: false,
    },
    icon: {
      type: Sequelize.TEXT
    },
    category: {
      type: Sequelize.TEXT
    },
    amount: {
      type: Sequelize.DECIMAL
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