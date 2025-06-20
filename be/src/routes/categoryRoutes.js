import express from "express";
import categoryController from "../controllers/categoryController.js";

let router = express.Router();

router.get("/category", categoryController.displayCategory);

router.get("/category/create", categoryController.getCreateCategory);
router.post("/category/create", categoryController.createCategory);
router.post("/category/update", categoryController.updateCategory);
router.get("/category/delete", categoryController.deleteCategory);

export default router;
