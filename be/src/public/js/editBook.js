document
  .querySelectorAll('[data-bs-target="#editBookModal"]')
  .forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("edit_book_id").value = this.dataset.id || "";
      document.getElementById("edit_isbn").value = this.dataset.isbn || "";
      document.getElementById("edit_title").value = this.dataset.title || "";
      document.getElementById("edit_author").value = this.dataset.author || "";
      document.getElementById("edit_publication_year").value =
        this.dataset.year || "";
      document.getElementById("edit_publisher").value =
        this.dataset.publisher || "";
      document.getElementById("edit_total_copies").value =
        this.dataset.total || "";
      document.getElementById("edit_available_copies").value =
        this.dataset.available || "";
      document.getElementById("edit_status").value = this.dataset.status || "";

      let selectedCategories = JSON.parse(this.dataset.categories || "[]");
      let categorySelect = document.querySelectorAll(
        "select[name='category_id'] option"
      );
      categorySelect.forEach((option) => {
        option.selected = selectedCategories.includes(parseInt(option.value));
      });

      document.getElementById("edit_description").value = this.dataset
        .description
        ? this.dataset.description
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        : "";

      let coverImage = this.dataset.cover || "";
      let imagePreview = document.getElementById("edit_image_preview");
      let currentCoverInput = document.getElementById("current_cover");

      if (coverImage) {
        imagePreview.src = `/uploads/${coverImage}`;
        imagePreview.style.display = "block";
        currentCoverInput.value = coverImage;
      } else {
        imagePreview.style.display = "none";
        currentCoverInput.value = "";
      }
    });
  });

document
  .getElementById("edit_cover_image")
  .addEventListener("change", function () {
    let input = this;
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("edit_image_preview").src = e.target.result;
        document.getElementById("edit_image_preview").style.display = "block";
      };
      reader.readAsDataURL(input.files[0]);
    }
  });

function confirmDeleteBook(bookId) {
  if (confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
    window.location.href = `/api/books/delete?book_id=` + bookId;
  }
}
