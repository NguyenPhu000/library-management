import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-4 px-6 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600">
          &copy; {currentYear} SERN Library Admin. Bản quyền thuộc về Thư viện
          SERN.
        </div>
        <div className="text-sm text-gray-500 mt-2 md:mt-0">
          Phiên bản 1.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;
