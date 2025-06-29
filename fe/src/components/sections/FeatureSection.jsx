import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faStar,
  faHeart,
  faShield,
  faUsers,
  faClock,
  faGlobe,
  faAward,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faBookOpen,
    title: "Kho Sách Phong Phú",
    description:
      "Hơn 1.000+ đầu sách đa dạng thể loại, từ văn học cổ điển đến khoa học hiện đại.",
    color: "bg-blue-50 text-library-primary",
    highlight: "1.000+",
  },
  {
    icon: faStar,
    title: "Chất Lượng Tuyển Chọn",
    description:
      "Những cuốn sách hay nhất được cộng đồng độc giả yêu thích và đánh giá cao.",
    color: "bg-yellow-50 text-yellow-600",
    highlight: "5⭐",
  },
  {
    icon: faHeart,
    title: "Dịch Vụ Miễn Phí",
    description:
      "Tiếp cận hàng ngàn đầu sách chất lượng hoàn toàn miễn phí cho mọi độc giả.",
    color: "bg-rose-50 text-rose-600",
    highlight: "100%",
  },
  {
    icon: faShield,
    title: "An Toàn & Tin Cậy",
    description:
      "Hệ thống quản lý hiện đại, bảo mật thông tin và trải nghiệm người dùng tối ưu.",
    color: "bg-green-50 text-green-600",
    highlight: "24/7",
  },
  {
    icon: faUsers,
    title: "Cộng Đồng Lớn",
    description:
      "Tham gia cộng đồng độc giả đông đảo với hơn 50+ thành viên tích cực.",
    color: "bg-purple-50 text-purple-600",
    highlight: "50+",
  },
  {
    icon: faClock,
    title: "Mở Cửa Mọi Lúc",
    description:
      "Thư viện số hoạt động 24/7, bạn có thể truy cập và mượn sách bất cứ lúc nào.",
    color: "bg-indigo-50 text-indigo-600",
    highlight: "24/7",
  },
  {
    icon: faGlobe,
    title: "Đa Ngôn Ngữ",
    description:
      "Sách bằng tiếng Việt, tiếng Anh và nhiều ngôn ngữ khác phục vụ mọi nhu cầu.",
    color: "bg-teal-50 text-teal-600",
    highlight: "3+",
  },
  {
    icon: faAward,
    title: "Đạt Chuẩn Quốc Tế",
    description:
      "Áp dụng các tiêu chuẩn quản lý thư viện hiện đại theo chuẩn quốc tế.",
    color: "bg-orange-50 text-orange-600",
    highlight: "ISO",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 md:py-24 bg-library-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-library-text-primary mb-6">
            Tại sao chọn{" "}
            <span className="text-library-primary">Góc Thư Viện</span>?
          </h2>
          <p className="text-xl text-library-text-secondary max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cam kết mang đến trải nghiệm đọc sách tuyệt vời nhất với
            những dịch vụ và tiện ích hàng đầu
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-library group hover:shadow-library-card hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-library-button ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <FontAwesomeIcon icon={feature.icon} className="w-6 h-6" />
                </div>
                <div className="bg-library-primary/10 text-library-primary px-3 py-1 rounded-library text-sm font-bold">
                  {feature.highlight}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-heading font-semibold text-library-text-primary mb-3 group-hover:text-library-primary transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-library-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-library-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-library-card" />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-library-surface rounded-library-card p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-library-primary mb-2">
                1,000+
              </div>
              <div className="text-library-text-secondary">Đầu Sách</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-library-primary mb-2">
                50+
              </div>
              <div className="text-library-text-secondary">Thành Viên</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-library-primary mb-2">
                20+
              </div>
              <div className="text-library-text-secondary">Danh Mục</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-library-primary mb-2">
                99%
              </div>
              <div className="text-library-text-secondary">Hài Lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
