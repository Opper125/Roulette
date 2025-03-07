const { getAllUsers } = require('./utils');

exports.handler = async () => {
    const users = getAllUsers();
    return {
        statusCode: 200,
        body: JSON.stringify(users)
    };
};
