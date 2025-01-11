let players = [];
let balances = {};
let transactions = [];
let wins = {}; // Track wins for each player
let poolAmount = 0;

document.getElementById("setupForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    poolAmount = parseFloat(document.getElementById("poolAmount").value);

    // Prompt for player names
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        const playerName = prompt(`Enter name for player ${i + 1}:`, `Player ${i + 1}`);
        players.push(playerName);
    }

    // Initialize balances and wins
    balances = {};
    wins = {};
    players.forEach(player => {
        balances[player] = 0;
        wins[player] = 0; // Initialize wins to 0
    });

    // Populate winner dropdown
    const winnerSelect = document.getElementById("winner");
    winnerSelect.innerHTML = players.map(player => `<option value="${player}">${player}</option>`).join("");

    // Switch to game page
    document.getElementById("setupPage").classList.add("hidden");
    document.getElementById("gamePage").classList.remove("hidden");
});

document.getElementById("winnerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const winner = document.getElementById("winner").value;

    // Update balances
    const lossAmount = poolAmount / (players.length - 1);
    players.forEach(player => {
        if (player === winner) {
            balances[player] += poolAmount;
            wins[player]++; // Increment win count
        } else {
            balances[player] -= lossAmount;
        }
    });

    calculateTransactions();
    displayResults();
});

function calculateTransactions() {
    const creditors = {};
    const debtors = {};

    // Separate creditors and debtors
    for (const player in balances) {
        if (balances[player] > 0) {
            creditors[player] = balances[player];
        } else if (balances[player] < 0) {
            debtors[player] = -balances[player];
        }
    }

    // Reset transactions
    transactions.length = 0;

    // Greedy algorithm for transactions
    while (Object.keys(debtors).length && Object.keys(creditors).length) {
        const debtor = Object.keys(debtors)[0];
        const creditor = Object.keys(creditors)[0];
        const debtAmount = debtors[debtor];
        const creditAmount = creditors[creditor];

        const transactionAmount = Math.min(debtAmount, creditAmount);
        transactions.push(`${debtor} owes ${creditor} $${transactionAmount.toFixed(2)}`);

        if (debtAmount > transactionAmount) {
            debtors[debtor] -= transactionAmount;
        } else {
            delete debtors[debtor];
        }

        if (creditAmount > transactionAmount) {
            creditors[creditor] -= transactionAmount;
        } else {
            delete creditors[creditor];
        }
    }
}

function displayResults() {
    const balancesDiv = document.getElementById("balances");
    const transactionsDiv = document.getElementById("transactions");
    const winsDiv = document.getElementById("wins");

    // Display balances
    balancesDiv.innerHTML = Object.entries(balances)
        .map(([player, balance]) => `<p>${player}: $${balance.toFixed(2)}</p>`)
        .join("");

    // Display transactions
    transactionsDiv.innerHTML = transactions.length
        ? transactions.map(t => `<p>${t}</p>`).join("")
        : "<p>No transactions needed</p>";

    // Display wins
    winsDiv.innerHTML = Object.entries(wins)
        .map(([player, winCount]) => `<p>${player}: ${winCount} wins</p>`)
        .join("");
}
