document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-container");
  const inputs = {
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
  };

  const errorMessages = {
    username: createErrorMessageElement(),
    password: createErrorMessageElement(),
    phone: createErrorMessageElement(),
    email: createErrorMessageElement(),
  };

  Object.keys(errorMessages).forEach((key) => {
    inputs[key].parentNode.appendChild(errorMessages[key]);
    errorMessages[key].style.display = "none"; // Ẩn vùng đỏ khi chưa có lỗi
  });

  form.addEventListener("submit", function (event) {
    let valid = true;

    // Xóa thông báo lỗi cũ
    clearErrorMessages();

    // Kiểm tra tên đăng nhập
    if (inputs.username.value.length < 6) {
      valid = false;
      errorMessages.username.textContent =
        "Tên đăng nhập phải có ít nhất 6 ký tự.";
      errorMessages.username.style.display = "block"; // Hiện thông báo lỗi
    }

    // Kiểm tra mật khẩu
    if (inputs.password.value.length < 6 || inputs.password.value.length > 12) {
      valid = false;
      errorMessages.password.textContent =
        "Mật khẩu phải có từ 6 đến 12 ký tự.";
      errorMessages.password.style.display = "block"; // Hiện thông báo lỗi
    }

    // Kiểm tra số điện thoại
    const phonePattern = /^\d{10}$/; // Kiểm tra số điện thoại phải là 10 chữ số
    const nonDigitPattern = /[^\d]/; // Kiểm tra có ký tự không phải số
    if (
      nonDigitPattern.test(inputs.phone.value) ||
      !phonePattern.test(inputs.phone.value)
    ) {
      valid = false;
      errorMessages.phone.textContent =
        "Số điện thoại phải đúng 10 số và không chứa chữ.";
      errorMessages.phone.style.display = "block"; // Hiện thông báo lỗi
    }

    // Kiểm tra email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputs.email.value)) {
      valid = false;
      errorMessages.email.textContent = "Email không đúng định dạng.";
      errorMessages.email.style.display = "block"; // Hiện thông báo lỗi
    }

    if (!valid) {
      event.preventDefault(); // Ngăn chặn gửi form nếu có lỗi
    }
  });

  function createErrorMessageElement() {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.display = "none"; // Ẩn vùng đỏ khi chưa có lỗi
    return errorDiv;
  }

  function clearErrorMessages() {
    Object.values(errorMessages).forEach((error) => {
      error.textContent = "";
      error.style.display = "none"; // Ẩn vùng đỏ khi xóa thông báo lỗi
    });
  }
});
