import axios from "axios";
import TEST_CONFIG, { isTestMode } from "../config/testConfig.js";

class VietQRService {
  constructor() {
    // VietQR configuration - có thể move vào environment variables
    this.config = {
      // API endpoint for VietQR
      apiUrl: "https://api.vietqr.io/v2/generate",

      // Bank info - ưu tiên ENV -> test mode -> mặc định
      bankId: process.env.VIETQR_BANK_ID
        ? process.env.VIETQR_BANK_ID
        : isTestMode()
        ? TEST_CONFIG.TEST_BANK.BANK_ID
        : "970415", // Vietinbank (mặc định)

      accountNo: process.env.VIETQR_ACCOUNT_NO
        ? process.env.VIETQR_ACCOUNT_NO
        : isTestMode()
        ? TEST_CONFIG.TEST_BANK.ACCOUNT_NO
        : "1234567890",

      accountName: process.env.VIETQR_ACCOUNT_NAME
        ? process.env.VIETQR_ACCOUNT_NAME
        : isTestMode()
        ? TEST_CONFIG.TEST_BANK.ACCOUNT_NAME
        : "THU VIEN TRUONG HOC",

      // Template
      template: "qr_only",
    };
  }

  /**
   * Generate QR code for payment
   * @param {Object} paymentData - Payment information
   * @returns {Object} QR code data and URL
   */
  async generateQR(paymentData) {
    try {
      const { payment_id, amount, description, member_code, book_title } =
        paymentData;

      // Create unique content for payment tracking
      const formattedMemberCode = member_code
        ? member_code.replace(/[^a-zA-Z0-9]/g, "")
        : "UNKNOWN_MEMBER";
      const formattedBookTitle = book_title
        ? book_title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_")
        : "UNKNOWN_BOOK";

      const paymentContent = isTestMode()
        ? `TEST_${formattedMemberCode}_${formattedBookTitle}`
        : `${formattedMemberCode}_${formattedBookTitle}`;

      // Nếu là test mode, tạo QR giả lập
      if (isTestMode()) {
        console.log("🧪 Test Mode: Generating mock QR code");
        return {
          success: true,
          qr_code_url: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
          qr_data: `TEST_QR|Bank:${this.config.bankId}|Account:${this.config.accountNo}|Amount:${amount}|Content:${paymentContent}`,
          bank_account_no: this.config.accountNo,
          payment_content: paymentContent,
          test_mode: true,
          mock_data: true,
        };
      }

      const requestData = {
        accountNo: this.config.accountNo,
        accountName: this.config.accountName,
        acqId: this.config.bankId,
        amount: parseInt(amount),
        addInfo: paymentContent,
        format: "text",
        template: this.config.template,
      };

      console.log("🔄 VietQR Request:", requestData);

      // Gọi VietQR API
      const response = await axios.post(this.config.apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.VIETQR_CLIENT_ID || "test-client",
          "x-api-key": process.env.VIETQR_API_KEY || "test-key",
        },
        timeout: 10000, // 10 seconds timeout
      });

      if (response.data.code === "00") {
        return {
          success: true,
          qr_code_url: response.data.data.qrDataURL,
          qr_data: response.data.data.qrCode,
          bank_account_no: this.config.accountNo,
          payment_content: paymentContent,
        };
      } else {
        throw new Error(`VietQR API Error: ${response.data.desc}`);
      }
    } catch (error) {
      console.error("❌ VietQR Service Error:", error.message);

      // Fallback: Generate simple QR text if API fails
      return {
        success: false,
        error: error.message,
        fallback: {
          qr_data: `Bank: ${this.config.bankId}|Account: ${
            this.config.accountNo
          }|Amount: ${paymentData.amount}|Content: ${
            isTestMode() ? "TEST_" : ""
          }PAY${paymentData.payment_id}`,
          bank_account_no: this.config.accountNo,
          payment_content: `${
            isTestMode() ? "TEST." : ""
          }P.${paymentData.payment_id
            .toString()
            .padStart(
              6,
              "0"
            )}.M.${formattedMemberCode}.B.${formattedBookTitle}`,
        },
      };
    }
  }

  /**
   * Verify webhook signature (if needed)
   * @param {Object} webhookData - Webhook payload
   * @param {string} signature - Webhook signature
   * @returns {boolean} Is valid signature
   */
  verifyWebhookSignature(webhookData, signature) {
    // TODO: Implement signature verification if VietQR provides webhook signatures
    // For now, return true (accept all webhooks)
    return true;
  }

  /**
   * Check if payment amount matches
   * @param {number} expectedAmount - Expected payment amount
   * @param {number} receivedAmount - Received payment amount
   * @returns {boolean} Amounts match
   */
  validateAmount(expectedAmount, receivedAmount) {
    return Math.abs(expectedAmount - receivedAmount) < 1; // Allow 1 VND difference
  }
}

export default new VietQRService();
