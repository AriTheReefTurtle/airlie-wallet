/* --------------------------------------------------
   Airlie Reef Project — wallet.js
   Pi App version for Stellar-style AIRLIE token
-------------------------------------------------- */

// ------------------------------
// 1. DOM Elements
// ------------------------------
const connectBtn = document.getElementById("connect-wallet-btn");
const statusMessage = document.getElementById("status-message");
const walletSection = document.getElementById("wallet-section");

const walletAddressField = document.getElementById("wallet-address");
const tokenBalanceField = document.getElementById("token-balance");


// ------------------------------
// 2. Initialize Pi SDK
// ------------------------------
Pi.init({
  version: "2.0",
  sandbox: false
});


// ------------------------------
// 3. Connect & Authenticate User
// ------------------------------
async function connectPiWallet() {
  try {
    statusMessage.textContent = "Requesting Pi authentication...";

    const scopes = ["username", "payments"];

    // Authenticate user
    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);

    const username = auth.user.username;
    const stellarAddress = auth.user.uid; // Pi UID = Stellar wallet address

    // Update UI
    walletAddressField.textContent = stellarAddress;
    statusMessage.textContent = `Connected as @${username}`;

    connectBtn.style.display = "none";
    walletSection.style.display = "block";

    // Fetch AIRLIE balance
    fetchAirlieBalance(stellarAddress);

  } catch (error) {
    console.error("Pi authentication error:", error);
    statusMessage.textContent = "Failed to connect Pi Wallet.";
  }
}


// ------------------------------
// 4. Handle Incomplete Payments
// ------------------------------
function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
}


// ------------------------------
// 5. Fetch AIRLIE Token Balance (Stellar-style)
// ------------------------------
async function fetchAirlieBalance(address) {
  try {
    tokenBalanceField.textContent = "Loading...";

    // Fetch account data from Pi Testnet Horizon
    const response = await fetch(
      `https://api.testnet.minepi.com/accounts/${address}`
    );

    const data = await response.json();

    // Find AIRLIE asset balance
    const airlieAsset = data.balances.find(
      (asset) =>
        asset.asset_code === "AIRLIE" &&
        asset.asset_issuer === "GDOW56GS47XLRDMJ4KPPAMRU6IZ57BIG5M26XMXIKFC7VY7D6TYBWSDR"
    );

    if (airlieAsset) {
      tokenBalanceField.textContent = airlieAsset.balance;
    } else {
      tokenBalanceField.textContent = "0";
    }

  } catch (error) {
    console.error("Balance fetch error:", error);
    tokenBalanceField.textContent = "Error loading balance";
  }
}


// ------------------------------
// 6. Event Listener
// ------------------------------
connectBtn.addEventListener("click", connectPiWallet);
