// Initial cryptocurrency data
const cryptocurrencies = {
  btc: {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    currentPrice: 50000, // Starting price in USD
    amount: 0, // Amount owned
    change: 0, // Price change percentage
    trend: [], // Price history
    color: "#3B82F6", // blue-500
  },
  eth: {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    currentPrice: 3000, // Starting price in USD
    amount: 0, // Amount owned
    change: 0, // Price change percentage
    trend: [], // Price history
    color: "#9333EA", // purple-600
  },
  ltc: {
    id: "ltc",
    name: "Litecoin",
    symbol: "LTC",
    currentPrice: 150, // Starting price in USD
    amount: 0, // Amount owned
    change: 0, // Price change percentage
    trend: [], // Price history
    color: "#38BDF8", // sky-400
  }
};

// Transaction history
const transactions = [];

// Price history for charts
const priceHistory = {
  btc: [],
  eth: [],
  ltc: []
};

// Function to update cryptocurrency price after transaction
function updateCryptoPrice(cryptoId, transactionType) {
  const crypto = cryptocurrencies[cryptoId];
  const oldPrice = crypto.currentPrice;
  
  if (transactionType === 'buy') {
    // Price increases by 0.2% on buy
    crypto.currentPrice = oldPrice * 1.002;
    crypto.change = 0.2;
  } else if (transactionType === 'sell') {
    // Price decreases by 0.5% on sell
    crypto.currentPrice = oldPrice * 0.995;
    crypto.change = -0.5;
  }
  
  // Update price history
  priceHistory[cryptoId].push({
    time: new Date().toLocaleTimeString(),
    price: crypto.currentPrice
  });
  
  // Keep only last 10 price points for trend
  if (priceHistory[cryptoId].length > 10) {
    priceHistory[cryptoId].shift();
  }
  
  // Update trend data
  crypto.trend = priceHistory[cryptoId].map(point => point.price);
}

// Function to add a new transaction
async function addTransaction(cryptoId, amount, type) {
  const crypto = cryptocurrencies[cryptoId];
  const transaction = {
    id: `tx${transactions.length + 1}`,
    currency: crypto.name,
    symbol: crypto.symbol,
    amount: amount,
    price: crypto.currentPrice,
    type: type, // 'buy' or 'sell'
    date: new Date().toLocaleDateString(),
    color: crypto.color
  };
  
  // Update amount owned
  if (type === 'buy') {
    crypto.amount += amount;
  } else if (type === 'sell') {
    crypto.amount -= amount;
  }
  
  // Update price
  updateCryptoPrice(cryptoId, type);
  
  // Add to transactions array
  transactions.unshift(transaction);
  
  // Keep only last 10 transactions
  if (transactions.length > 10) {
    transactions.pop();
  }
  
  // Update main chart
  updateMainChart();
  
  // Save the updated data
  await saveData();
  
  return transaction;
}

// Initialize price history with starting prices
Object.keys(cryptocurrencies).forEach(cryptoId => {
  const crypto = cryptocurrencies[cryptoId];
  priceHistory[cryptoId] = [{
    time: new Date().toLocaleTimeString(),
    price: crypto.currentPrice
  }];
  crypto.trend = [crypto.currentPrice];
});

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const collapseBtn = document.getElementById('collapse-sidebar');
const mainContent = document.querySelector('.main-content');
const walletCardsContainer = document.getElementById('wallet-cards');
const trendsGrid = document.getElementById('trends-grid');
const transactionList = document.getElementById('transaction-list');

// Global variables for chart
let mainChart;
let trendCharts = [];

// Sidebar Toggle
collapseBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
  
  // Update button icon
  if (sidebar.classList.contains('collapsed')) {
    collapseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
    `;
  } else {
    collapseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
    `;
  }
});

// Helper Functions
function getCurrencyIcon(id) {
  switch (id) {
    case "btc":
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bitcoin-icon">
          <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m3.94.694-.347 1.969M10.24 4.29l-1.05-.184m1.05.184-.346 1.969" />
          <path d="M6.903 5.86l3.94.695" />
        </svg>
      `;
    case "eth":
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ethereum-icon">
          <path d="m12 2 8 14H4z" />
          <path d="M4 16h16M4 21h16" />
          <path d="m7 9 5-5 5 5M7 15l5 5 5-5" />
        </svg>
      `;
    case "ltc":
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="litecoin-icon">
          <path d="M5 5h14l-5 14h-9z" />
          <path d="M5 15h12" />
        </svg>
      `;
    default:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bitcoin-icon">
          <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m3.94.694-.347 1.969M10.24 4.29l-1.05-.184m1.05.184-.346 1.969" />
          <path d="M6.903 5.86l3.94.695" />
        </svg>
      `;
  }
}

function renderTrendSVG(trend, color) {
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  
  // Normalize data to 0-1 range for SVG path
  const points = trend.map((value, index) => {
    const x = (index / (trend.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  });
  
  const startPoint = points[0].split(',')[0] + ',' + points[0].split(',')[1];
  const path = `M${startPoint} ${points.map(point => `L${point}`).join(' ')}`;
  
  return `
    <svg class="trend-svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="${path}"
        stroke="${color}"
        stroke-opacity="0.8"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="drop-shadow(0 0 3px ${color})"
      />
    </svg>
  `;
}

// Format numbers with commas for thousands
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format price with currency symbol
function formatPrice(price, currency = "$") {
  return `${currency}${formatNumber(parseFloat(price).toFixed(2))}`;
}

// Render Wallet Cards
function renderWalletCards() {
  let walletCardsHTML = '';
  
  Object.values(cryptocurrencies).forEach((crypto, index) => {
    const isPrimary = crypto.id === 'btc';
    const isPositive = crypto.change >= 0;
    
    walletCardsHTML += `
      <div class="wallet-card ${isPrimary ? 'primary' : ''}" data-index="${index}">
        <div class="wallet-header">
          <div class="wallet-amount">
            <div class="currency-icon">
              ${getCurrencyIcon(crypto.id)}
            </div>
            <span class="wallet-amount-value">${crypto.amount.toFixed(4)}</span>
          </div>
          <span class="wallet-symbol">${crypto.symbol}</span>
        </div>
        <div class="wallet-trend">
          <div class="trend-line">
            ${renderTrendSVG(crypto.trend, crypto.color)}
          </div>
          <span class="wallet-change ${isPositive ? 'change-positive' : 'change-negative'}">
            ${isPositive ? 
              `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>` : 
              `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trending-down"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`
            }
            ${isPositive ? '+' : ''}${crypto.change}%
          </span>
        </div>
      </div>
    `;
  });
  
  walletCardsContainer.innerHTML = walletCardsHTML;
  
  // Add click event for wallet cards
  document.querySelectorAll('.wallet-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      showWalletDetails(Object.values(cryptocurrencies)[index]);
    });
  });
}

// Render Trend Items
function renderTrendItems() {
  let trendsHTML = '';
  
  Object.values(cryptocurrencies).forEach((crypto, index) => {
    const isPositive = crypto.change >= 0;
    
    trendsHTML += `
      <div class="trend-item" data-index="${index}">
        <div class="trend-header">
          <div class="trend-name">
            <span class="trend-name-text">${crypto.name}</span>
            <span class="trend-currency">USD</span>
          </div>
          <span class="wallet-change ${isPositive ? 'change-positive' : 'change-negative'}">
            ${isPositive ? 
              `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>` : 
              `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trending-down"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`
            }
            ${isPositive ? '+' : ''}${crypto.change}%
          </span>
        </div>
        <div class="trend-value">$${crypto.currentPrice.toFixed(2)}</div>
        <div class="trend-chart">
          ${renderTrendSVG(crypto.trend, crypto.color)}
        </div>
      </div>
    `;
  });
  
  trendsGrid.innerHTML = trendsHTML;
  
  // Add click event to trend items
  document.querySelectorAll('.trend-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      showTrendDetails(Object.values(cryptocurrencies)[index]);
    });
  });
}

// Show trend details
function showTrendDetails(crypto) {
  showNotification(`${crypto.name} current price: $${crypto.currentPrice.toFixed(2)} (${crypto.change >= 0 ? '+' : ''}${crypto.change}%)`, 'info');
}

// Render Transaction Items
function renderTransactionItems() {
  let transactionsHTML = '';
  
  transactions.forEach((transaction, index) => {
    const isPositive = transaction.type === 'buy';
    
    transactionsHTML += `
      <div class="transaction-item" data-index="${index}">
        <div class="transaction-currency">
          <div class="currency-avatar" style="color: ${transaction.color}">
            ${getCurrencyIcon(transaction.currency.toLowerCase().includes('bitcoin') ? 'btc' : 
                             transaction.currency.toLowerCase().includes('ethereum') ? 'eth' : 'ltc')}
          </div>
          <span class="transaction-amount">${transaction.amount} ${transaction.symbol}</span>
        </div>
        <div class="transaction-details">
          <span class="transaction-change ${isPositive ? 'change-positive' : 'change-negative'}">
            ${isPositive ? '+' : '-'}${transaction.amount}
          </span>
          <span class="transaction-date">${transaction.date}</span>
        </div>
      </div>
    `;
  });
  
  transactionList.innerHTML = transactionsHTML;
  
  // Add click event to transaction items
  document.querySelectorAll('.transaction-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      showTransactionDetails(transactions[index]);
    });
  });
}

// Show wallet details modal
function showWalletDetails(crypto) {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <h2 class="modal-title">
      <div class="currency-icon">
        ${getCurrencyIcon(crypto.id)}
      </div>
      ${crypto.name} Details
    </h2>
    <button class="modal-close">×</button>
  `;
  
  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.innerHTML = `
    <div class="wallet-detail-stats">
      <div class="stat-item">
        <span class="stat-label">Current Amount</span>
        <span class="stat-value">${crypto.amount.toFixed(4)} ${crypto.symbol}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Current Price</span>
        <span class="stat-value">$${crypto.currentPrice.toFixed(2)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Change (24h)</span>
        <span class="stat-value ${crypto.change >= 0 ? 'change-positive' : 'change-negative'}">
          ${crypto.change >= 0 ? '+' : ''}${crypto.change}%
        </span>
      </div>
    </div>
    <div class="wallet-chart-container">
      <canvas id="wallet-detail-chart"></canvas>
    </div>
    <div class="wallet-actions">
      <button class="action-btn action-buy">Buy</button>
      <button class="action-btn action-sell">Sell</button>
    </div>
  `;
  
  // Assemble modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContainer.appendChild(modalContent);
  
  // Add modal to body
  document.body.appendChild(modalContainer);
  
  // Add close event to modal
  modalContainer.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  // Close modal when clicking outside of content
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      document.body.removeChild(modalContainer);
    }
  });
  
  // Add chart to modal
  setTimeout(() => {
    const ctx = document.getElementById('wallet-detail-chart');
    const detailChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: priceHistory[crypto.id].map(point => point.time),
        datasets: [{
          label: crypto.name + ' Price',
          data: priceHistory[crypto.id].map(point => point.price),
          borderColor: crypto.color,
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(26, 26, 35, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(75, 85, 99, 0.3)',
            borderWidth: 1,
          },
          legend: {
            display: false,
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748B',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7,
            }
          },
          y: {
            grid: {
              color: 'rgba(75, 85, 99, 0.1)',
            },
            ticks: {
              color: '#64748B',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
    
    // Add action button events
    modalContainer.querySelector('.action-buy').addEventListener('click', () => {
      const amount = prompt(`Enter amount of ${crypto.symbol} to buy:`);
      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        addTransaction(crypto.id, parseFloat(amount), 'buy');
        renderWalletCards();
        renderTransactionItems();
        showNotification(`Successfully bought ${amount} ${crypto.symbol}`, 'success');
      }
    });
    
    modalContainer.querySelector('.action-sell').addEventListener('click', () => {
      const amount = prompt(`Enter amount of ${crypto.symbol} to sell:`);
      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        if (parseFloat(amount) <= crypto.amount) {
          addTransaction(crypto.id, parseFloat(amount), 'sell');
          renderWalletCards();
          renderTransactionItems();
          showNotification(`Successfully sold ${amount} ${crypto.symbol}`, 'success');
        } else {
          showNotification(`You don't have enough ${crypto.symbol} to sell`, 'info');
        }
      }
    });
  }, 100);
}

// Show transaction details
function showTransactionDetails(transaction) {
  alert(`Transaction details: ${transaction.amount} ${transaction.currency} on ${transaction.date}`);
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-icon">
      ${type === 'success' ? 
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>` : 
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
      }
    </div>
    <div class="notification-content">
      <p>${message}</p>
    </div>
    <button class="notification-close">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Add close event
  notification.querySelector('.notification-close').addEventListener('click', () => {
    document.body.removeChild(notification);
  });
  
  // Auto close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('notification-visible');
  }, 10);
}

// Initialize Main Chart with Chart.js
function initMainChart() {
  const ctx = document.getElementById('main-chart');
  
  // Extract data for Chart.js
  const labels = priceHistory.btc.map(point => point.time);
  const btcData = priceHistory.btc.map(point => point.price);
  const ethData = priceHistory.eth.map(point => point.price);
  const ltcData = priceHistory.ltc.map(point => point.price);
  
  // Create gradient for BTC
  const btcGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  btcGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // blue-500
  btcGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
  
  // Create gradient for ETH
  const ethGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  ethGradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)'); // purple-600
  ethGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
  
  // Create gradient for LTC
  const ltcGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  ltcGradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)'); // sky-400
  ltcGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
  
  mainChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Bitcoin',
          data: btcData,
          borderColor: cryptocurrencies.btc.color,
          backgroundColor: btcGradient,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: cryptocurrencies.btc.color,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: '#ffffff',
        },
        {
          label: 'Ethereum',
          data: ethData,
          borderColor: cryptocurrencies.eth.color,
          backgroundColor: ethGradient,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: cryptocurrencies.eth.color,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: '#ffffff',
        },
        {
          label: 'Litecoin',
          data: ltcData,
          borderColor: cryptocurrencies.ltc.color,
          backgroundColor: ltcGradient,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: cryptocurrencies.ltc.color,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: '#ffffff',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(26, 26, 35, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(75, 85, 99, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 6,
          usePointStyle: true,
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 12,
            },
          }
        },
        y: {
          grid: {
            color: '#2D2D3A',
            drawBorder: false,
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 12,
            },
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Update chart data when transactions occur
function updateMainChart() {
  if (!mainChart) return;
  
  const newLabels = priceHistory.btc.map(point => point.time);
  const newBtcData = priceHistory.btc.map(point => point.price);
  const newEthData = priceHistory.eth.map(point => point.price);
  const newLtcData = priceHistory.ltc.map(point => point.price);
  
  mainChart.data.labels = newLabels;
  mainChart.data.datasets[0].data = newBtcData;
  mainChart.data.datasets[1].data = newEthData;
  mainChart.data.datasets[2].data = newLtcData;
  mainChart.update();
}

// Create and add CSS for modals and notifications
function addDynamicStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Modal Styles */
    .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    }
    
    .modal-content {
      background-color: var(--card-bg);
      border-radius: 0.75rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s forwards;
    }
    
    .modal-header {
      padding: 1rem;
      border-bottom: 1px solid rgba(75, 85, 99, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    
    .modal-title .currency-icon {
      margin-right: 0.5rem;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }
    
    .modal-close:hover {
      background-color: rgba(75, 85, 99, 0.1);
    }
    
    .modal-body {
      padding: 1rem;
    }
    
    .wallet-detail-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }
    
    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .wallet-chart-container {
      height: 200px;
      margin-bottom: 1rem;
    }
    
    .wallet-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
    
    .action-btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .action-buy {
      background-color: #10B981;
      color: white;
    }
    
    .action-buy:hover {
      background-color: #059669;
    }
    
    .action-sell {
      background-color: #EF4444;
      color: white;
    }
    
    .action-sell:hover {
      background-color: #DC2626;
    }
    
    .action-add-currency {
      background-color: var(--primary);
      color: white;
      width: 100%;
      margin-top: 1rem;
    }
    
    .action-add-currency:hover {
      background-color: #8B5CF6;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }
    
    .form-input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.375rem;
      background-color: var(--background);
      border: 1px solid rgba(75, 85, 99, 0.3);
      color: var(--text);
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(159, 0, 255, 0.2);
    }
    
    /* Notification Styles */
    .notification {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background-color: var(--card-bg);
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 50;
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .notification-visible {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-hiding {
      transform: translateX(120%);
      opacity: 0;
    }
    
    .notification-success {
      border-left: 4px solid #10B981;
    }
    
    .notification-info {
      border-left: 4px solid var(--primary);
    }
    
    .notification-icon {
      margin-right: 0.75rem;
      color: #10B981;
    }
    
    .notification-info .notification-icon {
      color: var(--primary);
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.25rem;
      cursor: pointer;
      margin-left: 0.5rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleElement);
}

// Update chart data randomly (for demo purposes)
function updateChartRandomly() {
  if (!mainChart) return;
  
  // Generate new data point
  const lastTime = chartData[chartData.length - 1].time;
  const hours = parseInt(lastTime.split(':')[0]);
  const minutes = parseInt(lastTime.split(':')[1].replace(/[APM]/g, ''));
  
  // Calculate new time (30 min increment)
  let newHours = hours;
  let newMinutes = minutes + 30;
  let period = lastTime.includes('PM') ? 'PM' : 'AM';
  
  if (newMinutes >= 60) {
    newMinutes = 0;
    newHours += 1;
    
    if (newHours > 12) {
      newHours = 1;
      period = period === 'AM' ? 'PM' : 'AM';
    }
  }
  
  const newTime = `${newHours}:${newMinutes < 10 ? '0' + newMinutes : newMinutes}${period}`;
  
  // Generate random data
  const lastMNX = chartData[chartData.length - 1].MNX;
  const lastCLQ = chartData[chartData.length - 1].CLQ;
  const lastSHX = chartData[chartData.length - 1].SHX;
  
  const randomChange = (base) => {
    const change = Math.random() * 400 - 200; // Random change between -200 and +200
    return Math.max(3000, Math.min(6000, base + change)); // Keep between 3000 and 6000
  };
  
  const newDataPoint = {
    time: newTime,
    MNX: randomChange(lastMNX),
    CLQ: randomChange(lastCLQ),
    SHX: randomChange(lastSHX)
  };
  
  // Add new data point and remove oldest
  chartData.push(newDataPoint);
  chartData.shift();
  
  // Update chart
  mainChart.data.labels = chartData.map(d => d.time);
  mainChart.data.datasets[0].data = chartData.map(d => d.MNX);
  mainChart.data.datasets[1].data = chartData.map(d => d.CLQ);
  mainChart.data.datasets[2].data = chartData.map(d => d.SHX);
  mainChart.update();
  
  // Show a notification occasionally
  if (Math.random() < 0.3) {
    const currencies = ['Bitcoin', 'Ethereum', 'Litecoin', 'Dogecoin', 'Ripple'];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
    const isUp = Math.random() > 0.5;
    const changePercent = (Math.random() * 5).toFixed(2);
    
    showNotification(
      `${randomCurrency} ${isUp ? 'up' : 'down'} by ${changePercent}% in the last hour.`,
      isUp ? 'success' : 'info'
    );
  }
}

// Handle theme toggle
function setupThemeToggle() {
  // Create theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle icon-btn';
  themeToggle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
  `;
  
  // Add toggle to header
  document.querySelector('.header-actions').prepend(themeToggle);
  
  // Check if user prefers dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDarkMode = true; // Default to dark mode for this dashboard
  
  // Apply initial theme
  document.documentElement.classList.toggle('light-theme', !isDarkMode);
  
  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('light-theme', !isDarkMode);
    
    // Update button icon
    themeToggle.innerHTML = isDarkMode ? 
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>` : 
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    
    // Update chart colors if needed
    if (mainChart) {
      mainChart.update();
    }
  });
  
  // Add light theme styles
  const lightThemeStyle = document.createElement('style');
  lightThemeStyle.textContent = `
    .light-theme {
      --background: #F8FAFC;
      --card-bg: #FFFFFF;
      --sidebar-bg: #F1F5F9;
      --border-color: rgba(203, 213, 225, 0.8);
      --text: #1E293B;
      --text-muted: #64748B;
    }
    
    .light-theme .sidebar {
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    
    .light-theme .header {
      background-color: rgba(248, 250, 252, 0.9);
      border-bottom: 1px solid rgba(203, 213, 225, 0.5);
    }
    
    .light-theme .icon-btn {
      background-color: #F1F5F9;
    }
    
    .light-theme .chart-section,
    .light-theme .card {
      border: 1px solid rgba(203, 213, 225, 0.8);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(lightThemeStyle);
}

// Responsive design adjustments
function handleResponsiveness() {
  // Check screen width and adjust sidebar accordingly
  function checkWidth() {
    if (window.innerWidth < 768) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
    } else {
      // Only expand if it was auto-collapsed
      if (sidebar.classList.contains('collapsed') && !sidebar.dataset.userCollapsed) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
      }
    }
  }
  
  // Initial check
  checkWidth();
  
  // Store user preference when manually toggling
  collapseBtn.addEventListener('click', () => {
    sidebar.dataset.userCollapsed = sidebar.classList.contains('collapsed') ? 'false' : 'true';
  });
  
  // Listen for window resize
  window.addEventListener('resize', checkWidth);
  
  // Add hamburger menu for mobile
  const header = document.querySelector('.header');
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-menu';
  hamburger.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
  `;
  
  header.prepend(hamburger);
  
  // Add hamburger style
  const hamburgerStyle = document.createElement('style');
  hamburgerStyle.textContent = `
    .hamburger-menu {
      display: none;
      background: none;
      border: none;
      color: var(--text);
      cursor: pointer;
      margin-right: 1rem;
    }
    
    @media (max-width: 768px) {
      .hamburger-menu {
        display: block;
      }
      
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .sidebar.mobile-active {
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(hamburgerStyle);
  
  // Toggle mobile sidebar
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-active');
  });
  
  // Close mobile sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && 
        sidebar.classList.contains('mobile-active') && 
        !sidebar.contains(e.target) && 
        e.target !== hamburger) {
      sidebar.classList.remove('mobile-active');
    }
  });
}

// Function to save data to the server
async function saveData() {
    try {
        const response = await fetch('/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                holdings: cryptocurrencies,
                priceHistory: priceHistory,
                transactions: transactions
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Failed to save data');
        }
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data. Please try again.');
    }
}

// Function to load data from the server
async function loadData() {
    try {
        const response = await fetch('/index.php', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Update the data structures
        cryptocurrencies = data.holdings || cryptocurrencies;
        priceHistory = data.priceHistory || priceHistory;
        transactions = data.transactions || transactions;
        
        // Update the UI
        updateCryptoList();
        updateTransactionHistory();
        updatePriceHistory();
        
        // Show welcome message if this is the first load
        if (transactions.length === 0) {
            showWelcomeMessage();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please refresh the page.');
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    // Load saved data
    await loadData();
    
    // Add dynamic styles first
    addDynamicStyles();
    
    // Render components
    renderWalletCards();
    renderTrendItems();
    renderTransactionItems();
    initMainChart();
    setupThemeToggle();
    handleResponsiveness();
    
    // Apply animations to cards using GSAP if available
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.wallet-card', 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
        );
        
        // Hover animations for wallet cards
        document.querySelectorAll('.wallet-card, .add-currency-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -5, duration: 0.2, ease: 'power2.out' });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.2, ease: 'power2.out' });
            });
        });
    }
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to your Cryptocurrency Dashboard!', 'info');
    }, 1000);
    
    // Set up periodic chart updates (every 30 seconds)
    setInterval(updateChartRandomly, 30000);
});

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor behavior

      // Remove 'active' class from all links
      navLinks.forEach(l => {
        l.classList.remove('active');
        l.querySelector('.sidebar-icon')?.classList.remove('active-icon');
      });

      // Add 'active' class to clicked link
      this.classList.add('active');
      this.querySelector('.sidebar-icon')?.classList.add('active-icon');
    });
  });
});