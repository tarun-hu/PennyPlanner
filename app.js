document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('finance-form');
    const historyList = document.getElementById('history-list');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search');
    const incomeChartEl = document.getElementById('incomeChart').getContext('2d');
    const expenseChartEl = document.getElementById('expenseChart').getContext('2d');

    let transactions = [];
    let incomeChart;
    let expenseChart;

    form.addEventListener('submit', addTransaction);
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', filterTransactions);

    function addTransaction(event) {
        event.preventDefault();

        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;

        if (!amount || !date) return;

        const transaction = { type, category, amount, date };
        transactions.push(transaction);

        updateOverview();
        updateHistory();
        updateCharts();

        form.reset();
    }

    function updateOverview() {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        totalIncomeEl.textContent = `Total Income: $${income.toFixed(2)}`;
        totalExpensesEl.textContent = `Total Expenses: $${expenses.toFixed(2)}`;
        balanceEl.textContent = `Balance: $${(income - expenses).toFixed(2)}`;
    }

    function updateHistory(filteredTransactions = transactions) {
        historyList.innerHTML = '';

        filteredTransactions.forEach((t) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${t.date} - ${t.category}: $${t.amount} (${t.type})`;
            historyList.appendChild(listItem);
        });
    }

    function filterTransactions() {
        const query = searchInput.value.toLowerCase();
        const filtered = transactions.filter(t => 
            t.category.toLowerCase().includes(query) || 
            t.date.includes(query)
        );
        updateHistory(filtered);
    }

    function updateCharts() {
        const incomeData = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const expenseData = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const incomeCategories = Object.keys(incomeData);
        const incomeAmounts = Object.values(incomeData);
        const expenseCategories = Object.keys(expenseData);
        const expenseAmounts = Object.values(expenseData);

        if (incomeChart) incomeChart.destroy();
        if (expenseChart) expenseChart.destroy();

        incomeChart = new Chart(incomeChartEl, {
            type: 'pie',
            data: {
                labels: incomeCategories,
                datasets: [{
                    label: 'Income',
                    data: incomeAmounts,
                    backgroundColor: ['#76c7c0', '#92a8d1', '#ffb74d', '#a3d9ff', '#f4a261', '#e76f51'],
                }],
            },
            options: {
                responsive: true,
            }
        });

        expenseChart = new Chart(expenseChartEl, {
            type: 'pie',
            data: {
                labels: expenseCategories,
                datasets: [{
                    label: 'Expenses',
                    data: expenseAmounts,
                    backgroundColor: ['#ff6f61', '#6b5b95', '#88b04b', '#f7cac9', '#92a8d1', '#ffb74d'],
                }],
            },
            options: {
                responsive: true,
            }
        });
    }

    function toggleTheme() {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
});
