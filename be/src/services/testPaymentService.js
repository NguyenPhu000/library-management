import axios from "axios";
import TEST_CONFIG, {
  isTestMode,
  getTestScenario,
  validateTestAmount,
} from "../config/testConfig.js";
import vietqrService from "./vietqrService.js";

class TestPaymentService {
  constructor() {
    this.activePayments = new Map(); // Lưu trữ các thanh toán đang xử lý
    this.webhookQueue = []; // Hàng đợi webhook
    this.virtualBalances = new Map(); // Số dư ảo của users
    this.paymentHistory = []; // Lịch sử thanh toán test
  }

  /**
   * Khởi tạo service test
   */
  initialize() {
    if (isTestMode()) {
      console.log("🧪 Test Payment Service initialized");
      this.startWebhookProcessor();
      this.generateSampleData();
    }
  }

  /**
   * Tạo dữ liệu mẫu cho test
   */
  generateSampleData() {
    if (!TEST_CONFIG.STATS_TEST_DATA.GENERATE_SAMPLE_DATA) return;

    const {
      SAMPLE_PAYMENTS_COUNT,
      DATE_RANGE_DAYS,
      PAYMENT_METHODS,
      AMOUNT_RANGE,
    } = TEST_CONFIG.STATS_TEST_DATA;

    console.log(`📊 Generating ${SAMPLE_PAYMENTS_COUNT} sample payments...`);

    for (let i = 0; i < SAMPLE_PAYMENTS_COUNT; i++) {
      const randomDate = new Date();
      randomDate.setDate(
        randomDate.getDate() - Math.floor(Math.random() * DATE_RANGE_DAYS)
      );

      const samplePayment = {
        payment_id: `TEST_${Date.now()}_${i}`,
        amount: Math.floor(
          Math.random() * (AMOUNT_RANGE[1] - AMOUNT_RANGE[0]) + AMOUNT_RANGE[0]
        ),
        payment_method:
          PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        status: Math.random() > 0.1 ? "APPROVED" : "PENDING",
        payment_date: randomDate,
        member_id: Math.floor(Math.random() * 100) + 1,
        loan_id: Math.floor(Math.random() * 200) + 1,
        description: `Test payment ${i + 1}`,
        is_test: true,
      };

      this.paymentHistory.push(samplePayment);
    }

    console.log(`✅ Generated ${this.paymentHistory.length} sample payments`);
  }

  /**
   * Tạo QR code test
   */
  async generateTestQR(paymentData) {
    if (!isTestMode()) {
      return await vietqrService.generateQR(paymentData);
    }

    const { payment_id, amount, description } = paymentData;
    const paymentContent = `TEST_PAY${payment_id.toString().padStart(6, "0")}`;

    // Mô phỏng QR code với thông tin test
    const testQRData = {
      success: true,
      qr_code_url: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      qr_data: `TEST_QR|Bank:${TEST_CONFIG.TEST_BANK.BANK_ID}|Account:${TEST_CONFIG.TEST_BANK.ACCOUNT_NO}|Amount:${amount}|Content:${paymentContent}`,
      bank_account_no: TEST_CONFIG.TEST_BANK.ACCOUNT_NO,
      payment_content: paymentContent,
      test_mode: true,
    };

    console.log("🧪 Generated test QR code:", paymentContent);
    return testQRData;
  }

  /**
   * Mô phỏng thanh toán tự động
   */
  async simulatePayment(paymentId, scenario = "NORMAL_PAYMENT") {
    if (!isTestMode()) {
      throw new Error("Test simulation only available in test mode");
    }

    const scenarioConfig = getTestScenario(scenario);
    const payment = this.activePayments.get(paymentId);

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found in active payments`);
    }

    console.log(
      `🧪 Simulating payment ${paymentId} with scenario: ${scenario}`
    );

    // Mô phỏng delay xử lý
    await new Promise((resolve) => setTimeout(resolve, scenarioConfig.delay));

    if (scenarioConfig.success) {
      // Thành công - tạo webhook
      await this.triggerTestWebhook(paymentId, {
        status: "SUCCESS",
        amount: payment.amount,
        payment_content: payment.payment_content,
        transaction_id: `TEST_TXN_${Date.now()}`,
        bank_account: TEST_CONFIG.TEST_BANK.ACCOUNT_NO,
      });
    } else {
      // Thất bại - tạo webhook lỗi
      await this.triggerTestWebhook(paymentId, {
        status: "FAILED",
        amount: payment.amount,
        payment_content: payment.payment_content,
        error: scenarioConfig.error,
        transaction_id: `TEST_TXN_FAILED_${Date.now()}`,
      });
    }

    return {
      success: scenarioConfig.success,
      scenario: scenario,
      delay: scenarioConfig.delay,
      error: scenarioConfig.error,
    };
  }

  /**
   * Kích hoạt webhook test
   */
  async triggerTestWebhook(paymentId, webhookData) {
    const webhook = {
      payment_id: paymentId,
      timestamp: new Date().toISOString(),
      data: webhookData,
      retry_count: 0,
      max_retries: TEST_CONFIG.WEBHOOK_SIMULATION.RETRY_COUNT,
    };

    this.webhookQueue.push(webhook);
    console.log(`📡 Webhook queued for payment ${paymentId}`);
  }

  /**
   * Xử lý webhook queue
   */
  startWebhookProcessor() {
    setInterval(async () => {
      if (this.webhookQueue.length === 0) return;

      const webhook = this.webhookQueue.shift();
      try {
        await this.processWebhook(webhook);
      } catch (error) {
        console.error(
          `❌ Webhook processing failed for payment ${webhook.payment_id}:`,
          error.message
        );

        // Retry logic
        if (webhook.retry_count < webhook.max_retries) {
          webhook.retry_count++;
          console.log(
            `🔄 Retrying webhook for payment ${webhook.payment_id} (attempt ${webhook.retry_count})`
          );
          setTimeout(() => {
            this.webhookQueue.push(webhook);
          }, TEST_CONFIG.WEBHOOK_SIMULATION.RETRY_DELAY);
        } else {
          console.error(
            `💀 Webhook failed permanently for payment ${webhook.payment_id}`
          );
        }
      }
    }, 1000); // Xử lý mỗi giây
  }

  /**
   * Xử lý webhook
   */
  async processWebhook(webhook) {
    const { payment_id, data } = webhook;

    try {
      // Gọi API xác nhận thanh toán
      const response = await axios.post(
        `${TEST_CONFIG.WEBHOOK_SIMULATION.BASE_URL}/api/payments/webhook-test`,
        {
          payment_id,
          status: data.status,
          amount: data.amount,
          transaction_id: data.transaction_id,
          payment_content: data.payment_content,
          bank_account: data.bank_account,
          error: data.error,
          test_mode: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Test-Webhook": "true",
          },
          timeout: 5000,
        }
      );

      console.log(
        `✅ Webhook processed successfully for payment ${payment_id}`
      );

      // Xóa khỏi active payments
      this.activePayments.delete(payment_id);

      return response.data;
    } catch (error) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  /**
   * Đăng ký thanh toán để theo dõi
   */
  registerPayment(paymentId, paymentData) {
    this.activePayments.set(paymentId, {
      ...paymentData,
      registered_at: new Date(),
      status: "PENDING",
    });

    console.log(`📝 Payment ${paymentId} registered for simulation`);
  }

  /**
   * Kiểm tra số dư ảo
   */
  getVirtualBalance(userId) {
    if (!this.virtualBalances.has(userId)) {
      this.virtualBalances.set(
        userId,
        TEST_CONFIG.VIRTUAL_MONEY.INITIAL_BALANCE
      );
    }
    return this.virtualBalances.get(userId);
  }

  /**
   * Trừ tiền ảo
   */
  deductVirtualBalance(userId, amount) {
    const currentBalance = this.getVirtualBalance(userId);
    if (currentBalance < amount) {
      throw new Error("Insufficient virtual balance");
    }

    this.virtualBalances.set(userId, currentBalance - amount);
    console.log(
      `💰 Deducted ${amount} VND from user ${userId}. New balance: ${
        currentBalance - amount
      }`
    );
  }

  /**
   * Lấy thống kê test
   */
  getTestStats() {
    const stats = {
      active_payments: this.activePayments.size,
      webhook_queue_size: this.webhookQueue.length,
      total_sample_payments: this.paymentHistory.length,
      virtual_balances: Object.fromEntries(this.virtualBalances),
      test_mode: isTestMode(),
      config: TEST_CONFIG,
    };

    return stats;
  }

  /**
   * Reset test data
   */
  resetTestData() {
    this.activePayments.clear();
    this.webhookQueue.length = 0;
    this.virtualBalances.clear();
    this.paymentHistory.length = 0;
    console.log("🧹 Test data reset");
  }

  /**
   * Mô phỏng các scenario edge cases
   */
  async simulateEdgeCases() {
    const scenarios = [
      "NORMAL_PAYMENT",
      "SLOW_PAYMENT",
      "FAILED_PAYMENT",
      "TIMEOUT_PAYMENT",
      "DUPLICATE_PAYMENT",
    ];

    const results = [];

    for (const scenario of scenarios) {
      try {
        const testPaymentId = `EDGE_TEST_${Date.now()}_${scenario}`;
        this.registerPayment(testPaymentId, {
          amount: 10000,
          payment_content: `TEST_${scenario}`,
          description: `Edge case test: ${scenario}`,
        });

        const result = await this.simulatePayment(testPaymentId, scenario);
        results.push({
          scenario,
          success: result.success,
          delay: result.delay,
          error: result.error,
        });
      } catch (error) {
        results.push({
          scenario,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }
}

export default new TestPaymentService();
