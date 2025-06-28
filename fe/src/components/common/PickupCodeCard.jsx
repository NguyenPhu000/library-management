import React, { useState } from "react";

const PickupCodeCard = ({ loan }) => {
  const [copied, setCopied] = useState(false);

  if (!loan?.pickup_code) {
    return null;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(loan.pickup_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getTimeRemaining = () => {
    if (!loan.hold_until) return null;

    const holdUntil = new Date(loan.hold_until);
    const now = new Date();
    const diffMs = holdUntil - now;

    if (diffMs <= 0) return "Đã hết hạn";

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `Còn ${diffDays} ngày`;
  };

  const timeRemaining = getTimeRemaining();
  const isExpired = timeRemaining === "Đã hết hạn";

  return (
    <div className={`pickup-code-card ${isExpired ? "expired" : ""}`}>
      <div className="pickup-header">
        <h3>🎫 Mã Nhận Sách</h3>
        <span className={`status-badge ${isExpired ? "expired" : "active"}`}>
          {isExpired ? "Hết hạn" : "Đang hoạt động"}
        </span>
      </div>

      <div className="pickup-code-display">
        <div className="code-container">
          <span className="pickup-code">{loan.pickup_code}</span>
          <button
            onClick={copyToClipboard}
            className={`copy-btn ${copied ? "copied" : ""}`}
            disabled={isExpired}
          >
            {copied ? "✅ Đã sao chép" : "📋 Sao chép"}
          </button>
        </div>
      </div>

      <div className="pickup-info">
        <div className="info-row">
          <span className="label">📚 Sách:</span>
          <span className="value">{loan.Book?.title}</span>
        </div>
        <div className="info-row">
          <span className="label">⏰ Thời hạn nhận:</span>
          <span
            className={`value ${
              isExpired ? "text-red-500" : "text-orange-500"
            }`}
          >
            {timeRemaining}
          </span>
        </div>
        <div className="info-row">
          <span className="label">📅 Ngày yêu cầu:</span>
          <span className="value">
            {new Date(loan.request_date).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      <div className="pickup-instructions">
        <h4>Hướng dẫn nhận sách:</h4>
        <ul>
          <li>Đến thư viện với mã nhận sách</li>
          <li>Đưa mã cho thủ thư để xác nhận</li>
          <li>Nhận sách và bắt đầu thời gian mượn (10 ngày)</li>
        </ul>
        {isExpired && (
          <div className="expired-notice">
            ⚠️ Mã đã hết hạn. Vui lòng yêu cầu mượn lại.
          </div>
        )}
      </div>

      <style>{`
        .pickup-code-card {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pickup-code-card.expired {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.15);
        }

        .pickup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .pickup-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.expired {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .pickup-code-display {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          text-align: center;
        }

        .code-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pickup-code {
          font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: 1px;
          color: #fff;
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .copy-btn {
          background: rgba(34, 197, 94, 0.9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .copy-btn:hover:not(:disabled) {
          background: rgba(34, 197, 94, 1);
          transform: translateY(-1px);
        }

        .copy-btn.copied {
          background: rgba(59, 130, 246, 0.9);
        }

        .copy-btn:disabled {
          background: rgba(107, 114, 128, 0.6);
          cursor: not-allowed;
        }

        .pickup-info {
          margin: 16px 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding: 0 4px;
        }

        .label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .value {
          font-size: 0.9rem;
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .pickup-instructions {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pickup-instructions h4 {
          margin: 0 0 8px 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .pickup-instructions ul {
          margin: 0;
          padding-left: 16px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.4;
        }

        .pickup-instructions li {
          margin-bottom: 4px;
        }

        .expired-notice {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #fca5a5;
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .pickup-code-card {
            padding: 16px;
            margin: 12px 0;
          }

          .pickup-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 12px;
          }

          .pickup-code {
            font-size: 1.1rem;
            padding: 6px 10px;
          }

          .copy-btn {
            padding: 6px 12px;
            font-size: 0.8rem;
          }

          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }

          .value {
            max-width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default PickupCodeCard;
