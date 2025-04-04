// edit button
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".edit-user-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("editUserId").value = this.dataset.id;
      document.getElementById("editUsername").value = this.dataset.username;
      document.getElementById("editFirstName").value = this.dataset.first_name;
      document.getElementById("editLastName").value = this.dataset.last_name;
      document.getElementById("editPhone").value = this.dataset.phone;
      document.getElementById("editRole").value = this.dataset.role;
      document.getElementById("editGender").value = this.dataset.gender;
      document.getElementById("editAddress").value = this.dataset.address;
      document.getElementById("editEmail").value = this.dataset.email;
    });
  });

  // Xử lý form tạo người dùng
  document
    .getElementById("createUserForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của form

      const formData = new FormData(this);
      const username = formData.get("username");
      const password = formData.get("password");
      const email = formData.get("email");
      const phone = formData.get("phone");

      // Kiểm tra tính hợp lệ
      if (!validateUserData(username, password, email, phone)) {
        return; // Dừng nếu dữ liệu không hợp lệ
      }

      // Gửi yêu cầu tạo người dùng
      fetch("/api/users/create", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi khi tạo người dùng");
          }
          return response.json();
        })
        .then((data) => {
          alert("Tạo người dùng thành công!");
          location.reload();
        })
        .catch((error) => {
          console.error("Lỗi:", error);
          alert("Tạo người dùng thất bại!");
        });
    });

  // Xử lý form chỉnh sửa người dùng
  document
    .getElementById("editUserForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const username = formData.get("username");
      const password = formData.get("password");
      const email = formData.get("email");
      const phone = formData.get("phone");

      // Kiểm tra tính hợp lệ
      if (!validateUserData(username, password, email, phone)) {
        return;
      }

      // Gửi yêu cầu chỉnh sửa người dùng
      fetch("/api/users/update", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi khi chỉnh sửa người dùng");
          }
          return response.json();
        })
        .then((data) => {
          alert("Chỉnh sửa người dùng thành công!");
          location.reload();
        })
        .catch((error) => {
          console.error("Lỗi:", error);
          alert("Chỉnh sửa người dùng thất bại!");
        });
    });
});

function confirmDelete(userId) {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
    fetch(`/api/users/delete?id=${userId}`, { method: "GET" }).then(() =>
      location.reload()
    );
  }
}
