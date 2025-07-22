import express from "express";
import path from "path";

const configViewEngine = (app) => {
  // Chỉ cấu hình view engine, không serve static files
  app.set("view engine", "ejs");
  const viewsPath = path.join(process.cwd(), "src", "views");
  app.set("views", viewsPath);
};

export default configViewEngine;
