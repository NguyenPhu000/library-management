"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Bước 1: Thêm cột mới tạm thời
    await queryInterface.addColumn("Books", "cover_image_temp", {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    });

    // Bước 2: Migration dữ liệu - chỉ giữ Base64, loại bỏ filename
    const books = await queryInterface.sequelize.query(
      "SELECT book_id, cover_image FROM Books WHERE cover_image IS NOT NULL",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const book of books) {
      let coverImageValue = null;

      // Chỉ xử lý Base64, bỏ qua filename
      if (book.cover_image) {
        if (
          typeof book.cover_image === "string" &&
          book.cover_image.startsWith("data:")
        ) {
          // Nếu là Base64, giữ lại
          coverImageValue = book.cover_image;
        } else if (
          Array.isArray(book.cover_image) &&
          book.cover_image.length > 0 &&
          book.cover_image[0].startsWith("data:")
        ) {
          // Nếu là array chứa Base64, lấy phần tử đầu
          coverImageValue = book.cover_image[0];
        }
        // Bỏ qua filename - không lưu vào cột mới
      }

      if (coverImageValue) {
        await queryInterface.sequelize.query(
          "UPDATE Books SET cover_image_temp = :coverImage WHERE book_id = :bookId",
          {
            replacements: { coverImage: coverImageValue, bookId: book.book_id },
            type: queryInterface.sequelize.QueryTypes.UPDATE,
          }
        );
      }
    }

    // Bước 3: Xóa cột cũ
    await queryInterface.removeColumn("Books", "cover_image");

    // Bước 4: Đổi tên cột mới thành tên cũ
    await queryInterface.renameColumn(
      "Books",
      "cover_image_temp",
      "cover_image"
    );
  },

  async down(queryInterface, Sequelize) {
    // Rollback: chuyển về JSON
    await queryInterface.changeColumn("Books", "cover_image", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });
  },
};
