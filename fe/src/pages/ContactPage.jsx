import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

const ContactPage = () => {
  return (
    <div className="font-poppins p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 text-gray-900 dark:text-white flex justify-center items-center min-h-[90vh] transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-gray-600 to-gray-800 dark:from-lightGreen dark:via-slate-400 dark:to-white">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Liên Hệ Với Góc Thư Viện
        </h1>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-5 md:p-8 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-base transition-colors duration-300">
            Chúng tôi luôn ở đây để lắng nghe và hỗ trợ bạn. Đừng ngần ngại kết
            nối!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Info Section */}
            <div>
              <h3 className="text-emerald-600 dark:text-lightGreen text-xl font-semibold mb-4 border-b border-emerald-200 dark:border-lightGreen/50 pb-2 inline-block transition-colors duration-300">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start group">
                  <div className="mr-3 mt-1 text-emerald-600 dark:text-lightGreen text-lg flex-shrink-0 transition-colors duration-300">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium text-base transition-colors duration-300">
                      Địa chỉ:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                      68 Đường Trần Chiên, Phường Lê Bình
                      <br />
                      Quận Cái Răng, Thành phố Cần Thơ
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center group">
                  <div className="mr-3 text-emerald-600 dark:text-lightGreen text-lg flex-shrink-0 transition-colors duration-300">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium text-base transition-colors duration-300">
                      Điện thoại:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                      <a
                        href="tel:+84123456789"
                        className="hover:text-emerald-600 dark:hover:text-lightGreen transition-colors duration-200"
                      >
                        +84 123 456 789
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center group">
                  <div className="mr-3 text-emerald-600 dark:text-lightGreen text-lg flex-shrink-0 transition-colors duration-300">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium text-base transition-colors duration-300">
                      Email:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                      <a
                        href="mailto:info@gocthuvien.com"
                        className="hover:text-emerald-600 dark:hover:text-lightGreen transition-colors duration-200"
                      >
                        info@gocthuvien.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-emerald-600 dark:text-lightGreen text-xl font-semibold mb-4 border-b border-emerald-200 dark:border-lightGreen/50 pb-2 inline-block transition-colors duration-300">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Giờ Mở Cửa
              </h3>
              <div className="space-y-3 bg-gray-100/50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner transition-colors duration-300">
                <div className="flex justify-between items-center">
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-sm transition-colors duration-300">
                    Thứ Hai - Thứ Sáu:
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-mono bg-gray-200/50 dark:bg-gray-900/50 px-2 py-1 rounded transition-colors duration-300">
                    8:00 - 21:00
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-sm transition-colors duration-300">
                    Thứ Bảy - Chủ Nhật:
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-mono bg-gray-200/50 dark:bg-gray-900/50 px-2 py-1 rounded transition-colors duration-300">
                    9:00 - 17:00
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-300/50 dark:border-gray-600/50 mt-3 transition-colors duration-300">
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-sm transition-colors duration-300">
                    Ngày lễ:
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-mono bg-red-200/50 dark:bg-red-900/50 px-2 py-1 rounded transition-colors duration-300">
                    Đóng cửa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 italic text-sm transition-colors duration-300">
              Góc Thư Viện - Nơi tri thức thăng hoa và cộng đồng gắn kết.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
