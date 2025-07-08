import React from "react";
import { FaBookOpen, FaStar, FaGift, FaUserShield } from "react-icons/fa";

const features = [
  {
    icon: FaBookOpen,
    color: "emerald",
    textColor: "text-emerald-400",
    shadowColor: "shadow-emerald-500/20",
    title: "Kho sách khổng lồ",
    description:
      "Hơn 50.000 đầu sách đa dạng thể loại, liên tục được cập nhật mới.",
  },
  {
    icon: FaStar,
    color: "yellow",
    textColor: "text-yellow-400",
    shadowColor: "shadow-yellow-500/20",
    title: "Chất lượng tuyển chọn",
    description:
      "Những cuốn sách hay nhất, được cộng đồng yêu thích và đánh giá cao.",
  },
  {
    icon: FaGift,
    color: "pink",
    textColor: "text-pink-400",
    shadowColor: "shadow-pink-500/20",
    title: "Hoàn toàn miễn phí",
    description:
      "Tiếp cận hàng ngàn đầu sách chất lượng mà không tốn bất kỳ chi phí nào.",
  },
  {
    icon: FaUserShield,
    color: "blue",
    textColor: "text-blue-400",
    shadowColor: "shadow-blue-500/20",
    title: "An toàn & Tiện lợi",
    description:
      "Trải nghiệm đọc sách mượt mà, an toàn với giao diện thân thiện, dễ sử dụng.",
  },
];

const FeatureSection = () => {
  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-10 tracking-tight bg-gradient-to-r from-white via-gray-300 to-emerald-400 text-transparent bg-clip-text">
          Tại sao chọn <span className="text-emerald-400">Góc Thư Viện</span>?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`relative p-4 md:p-5 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/40 transition-all duration-300 ease-out overflow-hidden hover:border-${feature.color}-500/30 hover:shadow-${feature.color}-500/10`}
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`mb-4 p-3 bg-gray-800/80 rounded-full inline-flex shadow-md ${feature.shadowColor}`}
                  >
                    <IconComponent
                      className={`text-2xl md:text-3xl ${feature.textColor}`}
                    />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-100">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
