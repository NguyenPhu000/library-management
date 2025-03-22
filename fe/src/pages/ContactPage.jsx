import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const ContactPage = () => {
  return (
    <div className="font-poppins p-4 bg-gray-900 text-white flex justify-center items-center min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <h1 className="text-lightGreen text-4xl font-bold mb-8 text-center">
          Thông Tin Liên Hệ - Góc Thư Viện
        </h1>
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 hover:shadow-xl transition-shadow duration-300 border border-gray-700">
          <p className="text-gray-300 mb-8 text-center text-lg">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua
            các kênh sau:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <h3 className="text-lightGreen text-2xl font-semibold mb-6 md:mb-8">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start md:items-center">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-4 md:mr-6 text-lightGreen text-xl md:text-2xl"
                  />
                  <div>
                    <p className="text-gray-200 font-semibold">Địa chỉ:</p>
                    <p className="text-gray-400 text-lg">
                      68 đường trần chiên
                      <br />
                      lê bình cái răng cần thơ
                    </p>
                  </div>
                </div>
                <div className="flex items-start md:items-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mr-4 md:mr-6 text-lightGreen text-xl md:text-2xl"
                  />
                  <div>
                    <p className="text-gray-200 font-semibold">Điện thoại:</p>
                    <p className="text-gray-400 text-lg">
                      <a
                        href="tel:+84123456789"
                        className="hover:text-lightGreen transition-colors duration-200"
                      >
                        +84 123 456 789
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start md:items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-4 md:mr-6 text-lightGreen text-xl md:text-2xl"
                  />
                  <div>
                    <p className="text-gray-200 font-semibold">Email:</p>
                    <p className="text-gray-400 text-lg">
                      <a
                        href="mailto:info@gocthuvien.com"
                        className="hover:text-lightGreen transition-colors duration-200"
                      >
                        info@gocthuvien.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lightGreen text-2xl font-semibold mb-6 md:mb-8">
                Giờ Mở Cửa
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-200 font-semibold">
                    Thứ Hai - Thứ Sáu:
                  </p>
                  <p className="text-gray-400 text-lg">8:00 - 21:00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-200 font-semibold">
                    Thứ Bảy - Chủ Nhật:
                  </p>
                  <p className="text-gray-400 text-lg">9:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-400 italic text-lg">
              Góc Thư Viện - Nơi tri thức gặp gỡ cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
