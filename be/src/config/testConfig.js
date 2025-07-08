// Test Configuration for Payment System
// Cấu hình test mode với tiền ảo để test an toàn

const TEST_CONFIG = {
  // Test mode flag
  TEST_MODE:
    process.env.NODE_ENV === "test" || process.env.PAYMENT_TEST_MODE === "true",

  // Virtual money configuration
  VIRTUAL_MONEY: {
    ENABLED: true,
    INITIAL_BALANCE: 1000000, // 1 triệu VND ảo
    MIN_AMOUNT: 1000, // Số tiền tối thiểu
    MAX_AMOUNT: 500000, // Số tiền tối đa
    CURRENCY: "VND",
    DECIMAL_PLACES: 0,
  },

  // Auto-confirmation settings
  AUTO_CONFIRM: {
    ENABLED: true,
    DELAY_MS: 2000, // Delay 2 giây để mô phỏng thời gian xử lý
    SUCCESS_RATE: 0.95, // 95% thành công
    TIMEOUT_MS: 30000, // Timeout sau 30 giây
  },

  // Webhook simulation
  WEBHOOK_SIMULATION: {
    ENABLED: true,
    BASE_URL: "http://localhost:3000",
    ENDPOINT: "/api/payments/webhook-test",
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
  },

  // Test bank account
  TEST_BANK: {
    BANK_ID: "999999",
    ACCOUNT_NO: "TEST123456789",
    ACCOUNT_NAME: "THU VIEN TEST",
    BANK_NAME: "NGAN HANG TEST",
  },

  // Test scenarios
  SCENARIOS: {
    NORMAL_PAYMENT: { success: true, delay: 2000 },
    SLOW_PAYMENT: { success: true, delay: 10000 },
    FAILED_PAYMENT: {
      success: false,
      delay: 5000,
      error: "Insufficient funds",
    },
    TIMEOUT_PAYMENT: { success: false, delay: 35000, error: "Payment timeout" },
    DUPLICATE_PAYMENT: {
      success: false,
      delay: 2000,
      error: "Duplicate payment",
    },
  },

  // Statistics test data
  STATS_TEST_DATA: {
    GENERATE_SAMPLE_DATA: true,
    SAMPLE_PAYMENTS_COUNT: 50,
    DATE_RANGE_DAYS: 30,
    PAYMENT_METHODS: ["cash", "qrcode"],
    AMOUNT_RANGE: [5000, 100000],
  },
};

// Helper functions
const isTestMode = () => {
  return TEST_CONFIG.TEST_MODE;
};

const getVirtualBalance = (userId) => {
  // Mô phỏng số dư ảo cho user
  return TEST_CONFIG.VIRTUAL_MONEY.INITIAL_BALANCE;
};

const validateTestAmount = (amount) => {
  const { MIN_AMOUNT, MAX_AMOUNT } = TEST_CONFIG.VIRTUAL_MONEY;
  return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
};

const getTestScenario = (scenarioName) => {
  return (
    TEST_CONFIG.SCENARIOS[scenarioName] || TEST_CONFIG.SCENARIOS.NORMAL_PAYMENT
  );
};

// Export configuration
export default TEST_CONFIG;
export { isTestMode, getVirtualBalance, validateTestAmount, getTestScenario };
