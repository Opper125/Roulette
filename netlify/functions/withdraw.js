const { saveUsers, getUser, updateBalance } = require('./utils');

exports.handler = async (event) => {
    const { username, amount } = JSON.parse(event.body);
    
    if (!username || !amount || amount <= 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid input' })
        };
    }

    const user = getUser(username);
    if (!user || user.balance < amount) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Insufficient balance or user not found' })
        };
    }

    updateBalance(username, -amount);
    saveUsers();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Withdrawn ${amount} chips from ${username}` })
    };
};
