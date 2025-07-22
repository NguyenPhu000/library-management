import React, { useState, useEffect } from "react";

const CategoryForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  categories = [],
  mode = "create", // "create" | "edit"
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
    setErrors({});
  }, [mode, initialData]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    } else if (name.trim().length < 2) {
      newErrors.name = "Tên danh mục phải có ít nhất 2 ký tự";
    } else if (name.trim().length > 100) {
      newErrors.name = "Tên danh mục không được quá 100 ký tự";
    }

    // Check duplicate name
    if (name.trim()) {
      const duplicate = categories.find(
        (cat) =>
          cat.name?.toLowerCase() === name.trim().toLowerCase() &&
          cat.id !== initialData?.id
      );
      if (duplicate) {
        newErrors.name = "Tên danh mục đã tồn tại";
      }
    }

    // Validate description
    if (description && description.trim().length > 500) {
      newErrors.description = "Mô tả không được quá 500 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = {
      name: name.trim(),
      description: description.trim(),
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Nhập tên danh mục..."
          value={name}
          onChange={handleNameChange}
          onBlur={validateForm}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.name
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          disabled={isSubmitting}
          autoComplete="off"
          maxLength={100}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {name.length}/100 ký tự
        </p>
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mô tả
        </label>
        <textarea
          placeholder="Nhập mô tả danh mục..."
          value={description}
          onChange={handleDescriptionChange}
          rows="4"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-colors ${
            errors.description
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          disabled={isSubmitting}
          autoComplete="off"
          maxLength={500}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description.length}/500 ký tự
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === "create" ? "Đang tạo..." : "Đang cập nhật..."}
            </>
          ) : mode === "create" ? (
            "Tạo danh mục"
          ) : (
            "Cập nhật"
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
