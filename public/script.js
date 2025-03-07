let selectedChip = null;
let bets = {};

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Betting Table ဖန်တီးခြင်း
function createBettingTable() {
    const table = document.getElementById('betting-table');
    table.innerHTML = '';
    
    // Numbers 0-12 (ဥပမာအနေဖြင့်)
    for (let i = 0; i <= 12; i++) {
        const div = document.createElement('div');
        div.className = `bet-option number ${i === 0 ? 'green' : (redNumbers.includes(i) ? 'red' : 'black')}`;
        div.dataset.value = i;
        div.textContent = i;
        div.onclick = () => placeBet(i);
        table.appendChild(div);
    }

    // Outside Bets
    ['red', 'black', 'even', 'odd', '1-18', '19-36'].forEach(value => {
        const div = document.createElement('div');
        div.className = 'bet-option';
        div.dataset.value = value;
        div.textContent = value;
        div.onclick = () => placeBet(value);
        table.appendChild(div);
    });
}

// Chip ရွေးချယ်ခြင်း
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedChip = parseInt(chip.dataset.value);
    });
});

// လောင်းကစားခြင်း
function placeBet(value) {
    if (!selectedChip) return alert('Please select a chip first!');
    if (!currentUser) return alert('Please login first!');
    
    const user = DataStore.getUser(currentUser);
    if (user.balance < selectedChip) return alert('Insufficient balance!');

    bets[value] = (bets[value] || 0) + selectedChip;
    user.balance -= selectedChip;
    DataStore.updateBalance(currentUser, -selectedChip);
    updateUserInfo();

    const option = document.querySelector(`[data-value="${value}"]`);
    option.textContent = `${value} (${bets[value]})`;
}

// ဝီးလှည့်ခြင်း
function spinWheel() {
    if (Object.keys(bets).length === 0) return alert('Place a bet first!');
    
    const wheel = document.getElementById('wheel');
    wheel.classList.add('spinning');
    setTimeout(() => {
        wheel.classList.remove('spinning');
        const result = Math.floor(Math.random() * 37);
        checkWin(result);
    }, 3000);
}

// အနိုင်ရမှုစစ်ဆေးခြင်း
function checkWin(result) {
    let winnings = 0;
    for (let bet in bets) {
        if (bet === result.toString()) winnings += bets[bet] * 35; // Straight bet
        else if (bet === 'red' && redNumbers.includes(result)) winnings += bets[bet] * 1;
        else if (bet === 'black' && !redNumbers.includes(result) && result !== 0) winnings += bets[bet] * 1;
        else if (bet === 'even' && result % 2 === 0 && result !== 0) winnings += bets[bet] * 1;
        else if (bet === 'odd' && result % 2 !== 0) winnings += bets[bet] * 1;
        else if (bet === '1-18' && result >= 1 && result <= 18) winnings += bets[bet] * 1;
        else if (bet === '19-36' && result >= 19 && result <= 36) winnings += bets[bet] * 1;
    }
    
    if (winnings > 0) {
        DataStore.updateBalance(currentUser, winnings);
        updateUserInfo();
    }
    
    document.getElementById('result').textContent = `Ball landed on ${result}. You won ${winnings} chips!`;
    bets = {};
    createBettingTable();
}

// လောင်းကစားရှင်းလင်းခြင်း
function clearBets() {
    bets = {};
    createBettingTable();
    document.getElementById('result').textContent = '';
}

// User အချက်အလက် ပြသခြင်း
function updateUserInfo() {
    const user = DataStore.getUser(currentUser);
    document.getElementById('username').textContent = currentUser || 'Guest';
    document.getElementById('balance').textContent = user ? user.balance : 0;
}

// Admin Panel ပြခြင်း/ဖွက်ခြင်း
function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}

function hideAdminPanel() {
    document.getElementById('admin-panel').style.display = 'none';
}

// ငွေသွင်းခြင်း
async function deposit() {
    const username = document.getElementById('admin-username').value;
    const amount = parseInt(document.getElementById('admin-amount').value);
    if (!username || !amount) return alert('Enter username and amount!');

    const response = await fetch('/.netlify/functions/deposit', {
        method: 'POST',
        body: JSON.stringify({ username, amount })
    });
    const result = await response.json();
    alert(result.message);
    if (username === currentUser) updateUserInfo();
}

// ငွေထုတ်ခြင်း
async function withdraw() {
    const username = document.getElementById('admin-username').value;
    const amount = parseInt(document.getElementById('admin-amount').value);
    if (!username || !amount) return alert('Enter username and amount!');

    const response = await fetch('/.netlify/functions/withdraw', {
        method: 'POST',
        body: JSON.stringify({ username, amount })
    });
    const result = await response.json();
    alert(result.message);
    if (username === currentUser) updateUserInfo();
}

// အသုံးပြုသူများပြခြင်း
async function fetchUsers() {
    const response = await fetch('/.netlify/functions/get-users');
    const users = await response.json();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '<h3>User Records</h3>' + 
        Object.entries(users).map(([name, data]) => `<p>${name}: ${data.balance} chips</p>`).join('');
}

// လော့ဂ်အောက်
function logout() {
    currentUser = null;
    updateUserInfo();
    document.getElementById('admin-panel').style.display = 'none';
}

// စတင်ချိန်
window.onload = () => {
    setCurrentUser(prompt('Enter your username:'));
    createBettingTable();
    updateUserInfo();
};
