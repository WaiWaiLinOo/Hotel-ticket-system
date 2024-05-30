module.exports = (sequelize, Sequelize) => {
  const resetToken = sequelize.define("reset_tokens", {
    token: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    created_at: {
        type: Sequelize.DATE,
      },
    expires_at: {
      type: Sequelize.DATE,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  });

  return resetToken;
};

