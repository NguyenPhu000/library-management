let fineAmount; // Biến để lưu fine_amount

function setPaymentData(paymentId, fine) {
  document.getElementById("payment_id").value = paymentId;
  fineAmount = fine; // Gán giá trị fine_amount
  document.getElementById("fineAmountDisplay").innerText =
    fineAmount.toLocaleString("vi-VN"); // Hiển thị số tiền phạt
}

document
  .getElementById("completePaymentBtn")
  .addEventListener("click", async () => {
    const paymentId = document.getElementById("payment_id").value;
    const amount = document.getElementById("amount").value;

    // Kiểm tra xem số tiền nhập vào có lớn hơn hoặc bằng fine_amount không
    if (amount < fineAmount) {
      alert(
        `Số tiền phải lớn hơn hoặc bằng ${fineAmount.toLocaleString(
          "vi-VN"
        )} VNĐ.`
      );
      return;
    }

    const response = await fetch("/api/payments/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId, amount }),
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      // Đóng modal sau khi xác nhận thành công
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("paymentModal")
      );
      modal.hide();
      // Cập nhật giao diện hoặc làm mới dữ liệu
    } else {
      alert(result.message);
    }
  });
