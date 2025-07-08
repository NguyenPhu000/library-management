import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const TestPaymentPanel = () => {
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testStats, setTestStats] = useState(null);

  // Test scenarios
  const testScenarios = [
    {
      id: "normal_payment",
      name: "Thanh toán bình thường",
      description: "Test tạo và xác nhận thanh toán thành công",
      data: {
        loan_id: 1,
        member_id: 1,
        amount: 50000,
        payment_method: "qrcode",
        description: "Test thanh toán bình thường",
      },
    },
    {
      id: "invalid_amount",
      name: "Số tiền không hợp lệ",
      description: "Test validation với số tiền âm",
      data: {
        loan_id: 1,
        member_id: 1,
        amount: -1000,
        payment_method: "qrcode",
        description: "Test số tiền không hợp lệ",
      },
      expectFail: true,
    },
    {
      id: "large_amount",
      name: "Thanh toán số tiền lớn",
      description: "Test với số tiền lớn",
      data: {
        loan_id: 2,
        member_id: 1,
        amount: 999999,
        payment_method: "qrcode",
        description: "Test thanh toán số tiền lớn",
      },
    },
    {
      id: "cash_payment",
      name: "Thanh toán tiền mặt",
      description: "Test thanh toán bằng tiền mặt",
      data: {
        loan_id: 3,
        member_id: 1,
        amount: 25000,
        payment_method: "cash",
        description: "Test thanh toán tiền mặt",
      },
    },
  ];

  useEffect(() => {
    checkTestMode();
  }, []);

  const checkTestMode = async () => {
    try {
      // Kiểm tra xem có đang ở test mode không
      const response = await api.get("/api/admin/payments/stats");
      setIsTestMode(true);
      toast.info("🧪 Test mode đã được kích hoạt", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Not in test mode or no access");
    }
  };

  const runSingleTest = async (scenario) => {
    try {
      const startTime = Date.now();

      // Tạo payment
      const createResponse = await api.post(
        "/api/payments/create",
        scenario.data
      );
      const duration = Date.now() - startTime;

      if (scenario.expectFail) {
        // Expect this to fail
        if (!createResponse.data.success) {
          return {
            id: scenario.id,
            name: scenario.name,
            success: true,
            message: "Validation hoạt động đúng - từ chối request không hợp lệ",
            duration,
          };
        } else {
          return {
            id: scenario.id,
            name: scenario.name,
            success: false,
            message: "Validation thất bại - chấp nhận request không hợp lệ",
            duration,
          };
        }
      } else {
        // Expect success
        if (createResponse.data.success) {
          const paymentId = createResponse.data.payment.payment_id;

          // Nếu là QR code, test webhook simulation
          if (scenario.data.payment_method === "qrcode") {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1s

            const webhookData = {
              payment_id: paymentId,
              status: "SUCCESS",
              amount: scenario.data.amount,
              transaction_id: `TEST_TXN_${Date.now()}`,
              payment_content: `TEST_PAY${paymentId
                .toString()
                .padStart(6, "0")}`,
              bank_account: "TEST123456789",
              test_mode: true,
            };

            const webhookResponse = await api.post(
              "/api/payments/webhook-test",
              webhookData
            );

            if (webhookResponse.data.success) {
              return {
                id: scenario.id,
                name: scenario.name,
                success: true,
                message: "Thanh toán và webhook thành công",
                paymentId,
                duration: Date.now() - startTime,
              };
            } else {
              return {
                id: scenario.id,
                name: scenario.name,
                success: false,
                message: "Webhook thất bại: " + webhookResponse.data.message,
                paymentId,
                duration: Date.now() - startTime,
              };
            }
          } else {
            return {
              id: scenario.id,
              name: scenario.name,
              success: true,
              message: "Thanh toán tiền mặt thành công",
              paymentId,
              duration,
            };
          }
        } else {
          return {
            id: scenario.id,
            name: scenario.name,
            success: false,
            message: "Tạo thanh toán thất bại: " + createResponse.data.message,
            duration,
          };
        }
      }
    } catch (error) {
      return {
        id: scenario.id,
        name: scenario.name,
        success: false,
        message: "Lỗi test: " + error.message,
        duration: Date.now() - startTime,
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      toast.info("🧪 Bắt đầu chạy test suite...", {
        position: "top-right",
        autoClose: 2000,
      });

      const results = [];

      for (const scenario of testScenarios) {
        const result = await runSingleTest(scenario);
        results.push(result);
        setTestResults([...results]); // Update UI incrementally

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Get final stats
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      setTestStats({
        total: results.length,
        success: successCount,
        failed: failCount,
        successRate: ((successCount / results.length) * 100).toFixed(1),
      });

      if (failCount === 0) {
        toast.success(`🎉 Tất cả ${successCount} test đã pass!`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.warning(
          `⚠️ ${successCount}/${results.length} test pass, ${failCount} test failed`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      toast.error("❌ Test suite thất bại: " + error.message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setTestStats(null);
  };

  if (!isTestMode) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">
          🔒 Test Panel không khả dụng
        </h3>
        <p className="text-gray-500">
          Test mode chưa được kích hoạt. Vui lòng thiết lập
          PAYMENT_TEST_MODE=true để sử dụng tính năng này.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🧪 Test Payment Panel
          </h2>
          <p className="text-gray-600 mt-1">
            Panel test hệ thống thanh toán với tiền ảo
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isRunning ? "🔄 Đang chạy..." : "🚀 Chạy tất cả test"}
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🗑️ Xóa kết quả
          </button>
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          📋 Test Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testScenarios.map((scenario) => (
            <div key={scenario.id} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-800">{scenario.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {scenario.description}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Amount: {scenario.data.amount.toLocaleString()} VND | Method:{" "}
                {scenario.data.payment_method}
                {scenario.expectFail && (
                  <span className="ml-2 text-red-600">(Expect Fail)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Stats */}
      {testStats && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Test Statistics
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {testStats.total}
              </div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {testStats.success}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {testStats.failed}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {testStats.successRate}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            📋 Test Results
          </h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xl ${
                        result.success ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.success ? "✅" : "❌"}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {result.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          result.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {result.duration && <div>{result.duration}ms</div>}
                    {result.paymentId && <div>ID: {result.paymentId}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Mode Warning */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600">⚠️</span>
          <div>
            <h4 className="font-medium text-yellow-800">Test Mode Active</h4>
            <p className="text-sm text-yellow-700">
              Tất cả thanh toán sử dụng tiền ảo. Không có tiền thật nào được xử
              lý.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPaymentPanel;
