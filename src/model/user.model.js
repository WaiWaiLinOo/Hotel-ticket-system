module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.STRING
        },
        role_id: Sequelize.INTEGER
    },
        {
            freezeTableName: true,
            tableName: 'users'
        });

    return User;
}
