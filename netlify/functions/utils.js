const fs = require('fs');
const path = require('path');

// Netlify တွင် ဖိုင်သိမ်းဆည်းမှု မရှိသောကြောင့်၊ ဤနေရာတွင် အလုပ်လုပ်ရန် အဆင်ပြေစေရန် ဒေတာကို ယာယီသိမ်းသည်
let users = {};

try {
    const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
    users = JSON.parse(data);
} catch (e) {
    users = {};
}

function saveUsers() {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users));
}

function getUser(username) {
    return users[username] || null;
}

function updateBalance(username, amount) {
    if (!users[username]) {
        users[username] = { balance: 0, bets: {} };
    }
    users[username].balance += amount;
}

function getAllUsers() {
    return users;
}

module.exports = { saveUsers, getUser, updateBalance, getAllUsers };
