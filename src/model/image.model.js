module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("image", {
      type: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.BLOB("long"),
      },
    },
    {
        freezeTableName: true,
        tableName: 'image'
    });
  
    return Image;
  };