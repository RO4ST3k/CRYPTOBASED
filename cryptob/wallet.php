<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/wallet.css">
    <!-- Include a library for animations -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body>
    <div class="app">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <div class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 12V6m0 0L9 9m3-3l3 3" />
                        <circle cx="12" cy="18" r="3" />
                        <path d="M6 10.5a6 6 0 1 1 12 0" />
                    </svg>
                </div>
                <span class="logo-text glow-text-primary">Crypto</span>
            </div>
            
            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="#" class="nav-link active">
                            <span class="sidebar-icon active-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                            </span>
                            <a href="index.html"><span class="nav-text" id="dashboard">Dashboard</span></a>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                            </span>
                            <span class="nav-text">Wallet</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </span>
                            <span class="nav-text">Messages</span>
                            <span class="notification-badge"></span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                            </span>
                            <span class="nav-text">Trade</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                            </span>
                            <span class="nav-text">Account Setting</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <button id="collapse-sidebar" class="collapse-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
            </button>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Header -->
            <header class="header">
                <h1 class="page-title">Wallet</h1>
                
                <div class="header-actions">
                    <button class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                    
                    <button class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    </button>
                    
                    <div class="notification-counter">
                        <div class="counter-badge">15</div>
                    </div>
                    
                    <div class="user-profile">
                        <div class="avatar">MI</div>
                        <div class="user-info">
                            <span class="username glow-text-primary">Mimi</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>
            </header>

            <div class="wallet-container">
                <div class="asset-border">
                    <img src="assets.png" alt="">
                </div>
                <p class="total-ass">Total Assets</p>
                <h3 class="ass-price">₱ 870,743</h3>

                <div class="depo-border">
                    <img src="wallet-money 1.png" alt="">
                </div>
                <p class="total-depo">Total Deposits</p>
                <h3 class="depo-price">₱ 450,000</h3>

                <div class="apy-border">
                    <img src="chart-square 1.png" alt="">
                </div>
                <p class="total-apy">APY</p>
                <h3 class="apy-price">+ 12.3%</h3>

                <div class="select-wrapper">
                    <select class="custom-select">
                      <option value="SHX">SHX</option>
                      <option value="LMA">LMA</option>
                      <option value="AIK">AIK</option>
                      <option value="CLQ">CLQ</option>
                      <option value="MNX">MNX</option>
                    </select>
                  </div>
                  <h3 class="curr-price">₱ 78,342</h3>
            </div>

            <div class="curr-container">
                <div class="shx-border">
                    <img src="shx.png" alt="">
                    <p>SHX</p>
                    <button>Buy Now</button>
                </div>

                <div class="lma-border">
                    <img src="lma.png" alt="">
                    <p>LMA</p>
                    <button>Buy Now</button>
                </div>

                <div class="aik-border">
                    <img src="aik.png" alt="">
                    <p>AIK</p>
                    <button>Buy Now</button>
                </div>

                <div class="clq-border">
                    <img src="clq.png" alt="">
                    <p>CLQ</p>
                    <button>Buy Now</button>
                </div>

                <div class="mnx-border">
                    <img src="mnx.png" alt="">
                    <p>MNX</p>
                    <button>Buy Now</button>
                </div>
            </div>  
            
            <div class="withdrawal-container">
                <div class="dropdown-container">
                    <select class="custom-select">
                      <option value="SHX">SHX</option>
                      <option value="LMA">LMA</option>
                      <option value="AIK">AIK</option>
                      <option value="CLQ">CLQ</option>
                      <option value="MNX">MNX</option>
                    </select>
                  </div>
                  <p class="coinbase-fee">COINBASE (LESS FEES)</p>
                  <label class="switch">
                    <input type="checkbox">
                    <span class="slider"></span>
                  </label>
                  <p class="direct-withdrawal">DIRECT WITHDRAWAL</p>
                  
                  <div class="withdraw-container">
                    <select class="withdraw-select">
                        <option value=""disabled selected>Select Withdrawal Method</option>
                      <option value="SHX">SHX</option>
                      <option value="LMA">LMA</option>
                      <option value="AIK">AIK</option>
                      <option value="CLQ">CLQ</option>
                      <option value="MNX">MNX</option>
                    </select>
                    <form action="" class="with-container">
                    <label for="" class="with-amo">Withdrawal Amount</label> <br>
                    <input type="text" class="withdraw-amount">
                </form>
                  </div>

                <div class="all"> <p>ALL</p></div>
                <div class="min"> <p>MIN</p></div>

                <p class="fee">Fee: ₱15.00</p>
                <button class="withdrawal-button">PLACE WITHDRAWAL</button>
            </div>

            <div class="qrcode-container">
                <div class="qrdropdown-container">
                    <select class="qrcustom-select">
                      <option value="SHX">SHX</option>
                      <option value="LMA">LMA</option>
                      <option value="AIK">AIK</option>
                      <option value="CLQ">CLQ</option>
                      <option value="MNX">MNX</option>
                    </select>
                  </div>
                  <img src="qr.png" alt="">
                  <button>DEPOSIT</button>
            </div>















            <script src="script.js"></script>

    
</body>
</html>