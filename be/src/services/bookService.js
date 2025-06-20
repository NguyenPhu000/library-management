import db from "../models/index.js";
import { Op } from "sequelize";

let getBookById = async (bookId) => {
  if (!bookId) throw new Error("Book ID is required!");
  const book = await db.Book.findOne({
    where: { book_id: bookId },
    include: [
      { model: db.Category, as: "categories", through: { attributes: [] } },
    ],
  });
  if (!book) throw new Error("Book not found!");
  return book;
};

let getAllBooks = async () => {
  return await db.Book.findAll({
    include: [
      { model: db.Category, as: "categories", through: { attributes: [] } },
    ],
  });
};

let createNewBooks = async (req) => {
  // Kiểm tra các trường bắt buộc
  if (!req.body.isbn || !req.body.title || !req.body.author) {
    throw new Error("Chưa nhập ISBN, tiêu đề và tác giả!");
  }

  // Kiểm tra năm xuất bản
  if (req.body.publication_year) {
    const publicationYear = parseInt(req.body.publication_year, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(publicationYear) || publicationYear.toString().length !== 4) {
      throw new Error("Năm xuất bản phải là một số 4 chữ số!");
    }

    if (publicationYear > currentYear) {
      throw new Error("Năm xuất bản không được vượt quá năm hiện tại!");
    }
  }

  let newBookData = {
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author,
    publication_year: req.body.publication_year,
    publisher: req.body.publisher,
    total_copies: req.body.total_copies || 0,
    available_copies: req.body.total_copies || 0,
    status: req.body.status,
    description: req.body.description,
    cover_image: req.file ? req.file.filename : null,
  };

  // Tạo sách mới
  const newBook = await db.Book.create(newBookData);

  // Lấy tất cả danh mục
  let allCategories = await db.Category.findAll({
    attributes: ["category_id"],
  });
  let validCategoryIds = new Set(allCategories.map((cat) => cat.category_id));

  // Kiểm tra và thêm danh mục
  if (req.body.category_id) {
    // Đảm bảo category_id là một mảng
    let categoryIds = Array.isArray(req.body.category_id)
      ? req.body.category_id.map((id) => parseInt(id))
      : [parseInt(req.body.category_id)];

    // Lọc các ID danh mục hợp lệ
    categoryIds = categoryIds.filter((id) => validCategoryIds.has(id));

    if (categoryIds.length > 0) {
      await newBook.addCategories(categoryIds);
    }
  }

  return newBook;
};

let updateBook = async (req) => {
  let bookId = req.body.book_id;
  if (!bookId) {
    throw new Error("Book ID is required!");
  }
  const existingBook = await getBookById(bookId);

  let coverImage =
    req.file?.filename || req.body.current_cover || existingBook.cover_image;

  let allCategories = await db.Category.findAll({
    attributes: ["category_id"],
  });
  let validCategoryIds = new Set(allCategories.map((cat) => cat.category_id));

  let categoryIds = req.body.category_id
    ? []
        .concat(req.body.category_id)
        .map((id) => parseInt(id))
        .filter((id) => validCategoryIds.has(id))
    : existingBook.categories.map((cat) => cat.category_id) || [];

  let updatedBookData = {
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author,
    publication_year: req.body.publication_year,
    publisher: req.body.publisher,
    total_copies: req.body.total_copies,
    status: req.body.status,
    description: req.body.description,
    cover_image: coverImage,
    category_id: categoryIds.length
      ? categoryIds
      : existingBook.categories.map((cat) => cat.category_id) || [],
  };

  // Cập nhật tổng số lượng sách
  await db.Book.update(updatedBookData, { where: { book_id: bookId } });

  // Cập nhật số lượng bản sao có sẵn
  if (req.body.total_copies) {
    const difference = req.body.total_copies - existingBook.total_copies;
    if (difference > 0) {
      await db.Book.increment("available_copies", {
        by: difference,
        where: { book_id: bookId },
      });
    } else if (difference < 0) {
      await db.Book.decrement("available_copies", {
        by: Math.abs(difference),
        where: { book_id: bookId },
      });
    }
  }

  // Cập nhật danh mục
  if (req.body.category_id && req.body.category_id.length > 0) {
    await db.BookCategory.destroy({ where: { book_id: bookId } });
    await existingBook.addCategories(req.body.category_id);
  }
};

let searchBook = async (filters) => {
  try {
    let whereClause = {};

    if (filters.criteria && filters.query) {
      const query = filters.query.trim();

      // Tùy thuộc vào tiêu chí tìm kiếm
      if (filters.criteria === "title") {
        // Tìm kiếm theo tiêu đề
        whereClause = {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { title: { [Op.substring]: query } },
          ],
        };
      } else if (filters.criteria === "author") {
        // Tìm kiếm theo tác giả
        whereClause = {
          [Op.or]: [
            { author: { [Op.like]: `%${query}%` } },
            { author: { [Op.substring]: query } },
          ],
        };
      } else if (filters.criteria === "isbn") {
        // Tìm kiếm chính xác theo ISBN
        whereClause = {
          isbn: { [Op.like]: `%${query}%` },
        };
      } else if (filters.criteria === "publisher") {
        // Tìm kiếm theo nhà xuất bản
        whereClause = {
          publisher: { [Op.like]: `%${query}%` },
        };
      } else if (filters.criteria === "all") {
        // Tìm kiếm theo tất cả các trường
        whereClause = {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { author: { [Op.like]: `%${query}%` } },
            { isbn: { [Op.like]: `%${query}%` } },
            { publisher: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        };
      } else {
        // Mặc định tìm kiếm theo tiêu đề
        whereClause[filters.criteria] = { [Op.like]: `%${query}%` };
      }
    }

    let books = await db.Book.findAll({
      where: whereClause,
      include: [
        { model: db.Category, as: "categories", through: { attributes: [] } },
      ],
      order: [
        ["title", "ASC"], // Sắp xếp kết quả theo tiêu đề
      ],
    });

    return books;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sách:", error);
    throw new Error("Không thể tìm kiếm sách, vui lòng thử lại!");
  }
};

let getBookByCategory = async (categoryId) => {
  if (!categoryId) throw new Error("Category ID is required!");

  try {
    let books = await db.Book.findAll({
      include: [
        {
          model: db.Category,
          as: "categories",
          where: { category_id: categoryId },
          through: { attributes: [] },
        },
      ],
    });

    return books;
  } catch (error) {
    console.error(" Lỗi khi lấy sách theo danh mục:", error);
    throw new Error("Không thể lấy sách theo danh mục.");
  }
};

let deleteBook = async (bookId) => {
  try {
    const r1 = await db.BookCategory.destroy({ where: { book_id: bookId } });
    const r2 = await db.Book.destroy({ where: { book_id: bookId } });

    if (!r1 && !r2) {
      throw new Error(
        `Book with ID ${bookId} not found or couldn't be deleted`
      );
    }

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export default {
  getBookById,
  getAllBooks,
  createNewBooks,
  updateBook,
  deleteBook,
  searchBook,
  getBookByCategory,
};
