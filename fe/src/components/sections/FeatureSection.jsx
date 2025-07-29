import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faStar,
  faGift,
  faShield,
  faInfinity,
  faHeart,
  faCrown,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faBookOpen,
    gradient: "from-[#5E936C] to-[#93DA97]",
    textColor: "text-[#93DA97]",
    hoverColor: "hover:text-[#E8FFD7]",
    shadowColor: "shadow-[#5E936C]/30",
    title: "Kho Tàng Tri Thức Khổng Lồ",
    description:
      "Hơn 50.000 đầu sách đa dạng thể loại từ văn học cổ điển đến khoa học hiện đại, liên tục được cập nhật mới mỗi ngày.",
    stats: "50,000+ sách",
    decorIcon: faInfinity,
  },
  {
    icon: faStar,
    gradient: "from-[#93DA97] to-[#E8FFD7]",
    textColor: "text-[#E8FFD7]",
    hoverColor: "hover:text-[#93DA97]",
    shadowColor: "shadow-[#93DA97]/30",
    title: "Chất Lượng Tuyển Chọn",
    description:
      "Những cuốn sách hay nhất được cộng đồng độc giả yêu thích, đánh giá cao và các chuyên gia khuyến đọc.",
    stats: "4.8/5 ⭐",
    decorIcon: faCrown,
  },
  {
    icon: faGift,
    gradient: "from-[#3E5F44] to-[#5E936C]",
    textColor: "text-[#5E936C]",
    hoverColor: "hover:text-[#93DA97]",
    shadowColor: "shadow-[#3E5F44]/30",
    title: "Hoàn Toàn Miễn Phí",
    description:
      "Tiếp cận kho tàng tri thức chất lượng cao mà không tốn bất kỳ chi phí nào. Mọi dịch vụ đều miễn phí 100%.",
    stats: "0đ phí",
    decorIcon: faHeart,
  },
  {
    icon: faShield,
    gradient: "from-[#5E936C] to-[#3E5F44]",
    textColor: "text-[#5E936C]",
    hoverColor: "hover:text-[#E8FFD7]",
    shadowColor: "shadow-[#5E936C]/30",
    title: "An Toàn & Bảo Mật",
    description:
      "Hệ thống bảo mật cao cấp, giao diện thân thiện và trải nghiệm đọc sách mượt mà trên mọi thiết bị.",
    stats: "100% an toàn",
    decorIcon: faLock,
  },
];

const FeatureSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#93DA97]/20 to-[#E8FFD7]/20 filter blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-[#5E936C]/15 to-[#93DA97]/15 filter blur-3xl animate-pulse delay-2000" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-bounce delay-300">
        <FontAwesomeIcon
          icon={faBookOpen}
          className="text-[#93DA97] text-2xl opacity-40"
        />
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-700">
        <FontAwesomeIcon
          icon={faStar}
          className="text-[#E8FFD7] text-xl opacity-30"
        />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-1000">
        <FontAwesomeIcon
          icon={faHeart}
          className="text-[#5E936C] text-2xl opacity-35"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 backdrop-blur-sm border border-[#5E936C]/30 dark:border-[#93DA97]/30 rounded-full px-6 py-3 mb-6 text-sm font-medium text-[#5E936C] dark:text-[#E8FFD7]">
            <FontAwesomeIcon
              icon={faStar}
              className="mr-2 text-[#5E936C] dark:text-[#93DA97]"
            />
            Tại sao chọn chúng tôi
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-[#3E5F44] to-[#5E936C] dark:from-white dark:via-[#E8FFD7] dark:to-[#93DA97] text-transparent bg-clip-text">
              Trải Nghiệm Đọc Sách
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#5E936C] to-[#3E5F44] dark:from-[#93DA97] dark:to-[#5E936C] text-transparent bg-clip-text">
              Tuyệt Vời Nhất
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
            Khám phá những tính năng đặc biệt giúp bạn có trải nghiệm đọc sách
            trực tuyến tốt nhất
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/40 to-gray-100/40 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-300/40 dark:border-gray-700/40 hover:border-[#5E936C]/60 dark:hover:border-[#93DA97]/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#5E936C]/20 dark:hover:shadow-[#93DA97]/20"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
              ></div>

              {/* Decorative Icon */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <FontAwesomeIcon
                  icon={feature.decorIcon}
                  className={`text-2xl ${feature.textColor}`}
                />
              </div>

              <div className="relative z-10">
                {/* Main Icon */}
                <div
                  className={`mb-6 p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl inline-flex shadow-xl ${feature.shadowColor} group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                >
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="text-3xl text-gray-900"
                  />
                </div>

                {/* Stats Badge */}
                <div
                  className={`inline-flex items-center bg-gradient-to-r from-gray-200/60 to-gray-300/60 dark:from-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm border border-gray-400/40 dark:border-gray-600/40 rounded-full px-3 py-1 mb-4 text-xs font-medium ${feature.textColor}`}
                >
                  {feature.stats}
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl font-bold mb-4 ${feature.hoverColor} transition-colors duration-300 leading-tight`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Effect Arrow */}
                <div className="flex items-center mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span
                    className={`text-sm font-medium ${feature.textColor} mr-2`}
                  >
                    Tìm hiểu thêm
                  </span>
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className={`text-sm ${feature.textColor}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Bắt đầu hành trình khám phá tri thức cùng chúng tôi
          </p>
          <button className="bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white font-semibold text-lg py-4 px-8 rounded-full transition-all duration-300 ease-in-out shadow-xl hover:shadow-[#5E936C]/30 hover:scale-105">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
