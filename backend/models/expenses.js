module.exports = (sequelize, Sequelize) => {
    var Model = sequelize.define('expenses', {
      id:{
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true
      },
      batch_id: {
        type: Sequelize.TEXT
      },
      site_id: {
        type: Sequelize.TEXT
      },
      van_id:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      amount:{
        type: Sequelize.DECIMAL
      },
      trans_date:{
        type: Sequelize.DATE
      },
      created_by:{
        type: Sequelize.TEXT,
        allowNull: false  
      },
      updated_by:{
        type: Sequelize.TEXT,
        allowNull: false  
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