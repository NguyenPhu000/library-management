import { createContext, useContext, useEffect, useState } from "react";
import categoryService from "../services/categoryService";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
