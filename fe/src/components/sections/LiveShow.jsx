import React from "react";
import Slider from "react-slick";
import { useBook } from "../../contexts/BookContext";
import { generateSlug } from "../../utils/slugify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";

const LiveShow = () => {
  const { books } = useBook();

  const getRandomBooks = (count) => {
    const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
    return shuffledBooks.slice(0, count);
  };

  const randomBooks = getRandomBooks(5);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        Sách Ngẫu Nhiên
      </h2>
      {randomBooks.length > 0 ? (
        <Slider {...settings}>
          {randomBooks.map((book) => {
            const slug = generateSlug(book.book_id);
            return (
              <motion.div key={book.book_id} className="p-4">
                <Link to={`/books/${slug}`}>
                  <motion.div
                    className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden group hover:shadow-2xl cursor-pointer transform-gpu hover:-rotate-3 hover:translate-y-1 transition duration-300 ease-in-out"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    title={book.title || "Không có tiêu đề"}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={book.cover_image}
                        alt={book.title || "Không có tiêu đề"}
                        className="w-full h-96 object-cover rounded-t-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {book.title || "Không có tiêu đề"}
                      </h3>
                      <p className="text-gray-400 text-sm truncate flex items-center font-semibold">
                        <FontAwesomeIcon icon={faPenNib} className="mr-1" />
                        {book.author || "Không rõ tác giả"}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </Slider>
      ) : (
        <p className="text-center text-white">Không có sách nào để hiển thị.</p>
      )}
    </div>
  );
};

export default LiveShow;
