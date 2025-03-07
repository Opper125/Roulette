// Local storage အစားထိုး ဒေတာသိမ်းဆည်းရန်
const DataStore = {
    users: JSON.parse(localStorage.getItem('users')) || {},
    
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    },

    getUser(username) {
        return this.users[username] || null;
    },

    addUser(username, balance = 0) {
        if (!this.users[username]) {
            this.users[username] = { balance, bets: {} };
            this.saveUsers();
        }
    },

    updateBalance(username, amount) {
        if (this.users[username]) {
            this.users[username].balance += amount;
            this.saveUsers();
        }
    },

    getAllUsers() {
        return this.users;
    }
};

// လက်ရှိအသုံးပြုသူ
let currentUser = null;

function setCurrentUser(username) {
    currentUser = username;
    DataStore.addUser(username);
}

function getCurrentUser() {
    return currentUser;
}
