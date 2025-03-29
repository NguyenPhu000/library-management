import db from "../models/index.js";
import { Op } from "sequelize";

// Hàm lấy sách theo ID
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

// Hàm lấy tất cả sách
let getAllBooks = async () => {
  return await db.Book.findAll({
    include: [
      { model: db.Category, as: "categories", through: { attributes: [] } },
    ],
  });
};

// Hàm tạo sách mới
let createNewBooks = async (req) => {
  let newBookData = {
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author,
    publication_year: req.body.publication_year,
    publisher: req.body.publisher,
    total_copies: req.body.total_copies,
    available_copies: req.body.available_copies,
    status: req.body.status,
    category: req.body.category,
    description: req.body.description,
    cover_image: req.file ? req.file.filename : null,
    category_id: Array.isArray(req.body.category_id)
      ? req.body.category_id
      : [req.body.category_id],
  };

  return await db.Book.create(newBookData);
};

// Hàm cập nhật sách
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
    available_copies: req.body.available_copies,
    status: req.body.status,
    description: req.body.description,
    cover_image: coverImage,
    category_id: categoryIds.length
      ? categoryIds
      : existingBook.categories.map((cat) => cat.category_id) || [],
  };

  await db.Book.update(updatedBookData, { where: { book_id: bookId } });

  if (req.body.category_id && req.body.category_id.length > 0) {
    await db.BookCategory.destroy({ where: { book_id: bookId } });
    await existingBook.addCategories(req.body.category_id);
  }
};

// Hàm tìm kiếm sách
let searchBook = async (filters) => {
  try {
    let whereClause = {};

    if (filters.criteria && filters.query) {
      whereClause[filters.criteria] = { [Op.like]: `%${filters.query}%` };
    }

    let books = await db.Book.findAll({
      where: whereClause,
      include: [
        { model: db.Category, as: "categories", through: { attributes: [] } },
      ],
    });
    return books;
  } catch (error) {
    throw new Error("Không thể tìm kiếm sách, vui lòng thử lại!");
  }
};

// Hàm lấy sách theo danh mục
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

// Hàm xóa sách
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
