import { createContext, useContext, useEffect, useState } from "react";
import categoryService from "../services/categoryService";

const CACHE_KEY = "categories_cache_v1";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: Load from cache
  const loadCachedCategories = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data || [];
      }
    } catch (err) {
      console.warn("Failed to parse cached categories:", err);
    }
    return null;
  };

  // Helper: Save to cache
  const saveCachedCategories = (data) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      console.warn("Failed to cache categories:", err);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories();
      const fetched = response.categories || [];
      setCategories(fetched);
      saveCachedCategories(fetched);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      setError("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  // Initial load (cache first)
  useEffect(() => {
    const cached = loadCachedCategories();
    if (cached) {
      setCategories(cached);
      setLoading(false);
    } else {
      fetchCategories();
    }

    // Refresh when back online
    const handleOnline = () => {
      fetchCategories();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, loading, error, refreshCategories: fetchCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
