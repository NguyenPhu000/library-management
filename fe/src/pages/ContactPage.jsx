import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faBuilding,
  faGlobe,
  faUsers,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: "Địa chỉ",
      content: (
        <div>
          <p>68 Đường Trần Chiên, Phường Lê Bình</p>
          <p>Quận Cái Răng, Thành phố Cần Thơ</p>
        </div>
      ),
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: faPhone,
      title: "Điện thoại",
      content: (
        <a
          href="tel:+84123456789"
          className="text-library-primary hover:text-library-primary/80 transition-colors"
        >
          +84 123 456 789
        </a>
      ),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: faEnvelope,
      title: "Email",
      content: (
        <a
          href="mailto:info@gocthuvien.com"
          className="text-library-primary hover:text-library-primary/80 transition-colors"
        >
          info@gocthuvien.com
        </a>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: faGlobe,
      title: "Website",
      content: (
        <a
          href="https://gocthuvien.com"
          className="text-library-primary hover:text-library-primary/80 transition-colors"
        >
          www.gocthuvien.com
        </a>
      ),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const operatingHours = [
    { day: "Thứ Hai - Thứ Sáu", time: "8:00 - 21:00", status: "open" },
    { day: "Thứ Bảy", time: "9:00 - 17:00", status: "open" },
    { day: "Chủ Nhật", time: "9:00 - 17:00", status: "open" },
    { day: "Ngày lễ", time: "Đóng cửa", status: "closed" },
  ];

  return (
    <div className="min-h-screen bg-library-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <FontAwesomeIcon
              icon={faBuilding}
              className="text-library-primary mr-3 w-8 h-8"
            />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-library-text-primary">
              Liên Hệ Với Chúng Tôi
            </h1>
          </div>
          <p className="text-xl text-library-text-secondary max-w-3xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với Góc
            Thư Viện để được tư vấn và giải đáp mọi thắc mắc.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-library-text-primary mb-8 flex items-center">
              <FontAwesomeIcon
                icon={faUsers}
                className="mr-3 text-library-primary"
              />
              Thông Tin Liên Hệ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="card-library group hover:shadow-library-card transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 ${item.bg} ${item.color} rounded-library-button flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-library-text-primary mb-2">
                    {item.title}
                  </h3>
                  <div className="text-library-text-secondary">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-library-text-primary mb-8 flex items-center">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-3 text-library-primary"
              />
              Giờ Mở Cửa
            </h2>

            <div className="card-library">
              <div className="space-y-4">
                {operatingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-library-border last:border-b-0"
                  >
                    <span className="font-medium text-library-text-primary">
                      {schedule.day}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-library text-sm font-medium ${
                        schedule.status === "open"
                          ? "bg-library-success/10 text-library-success"
                          : "bg-library-error/10 text-library-error"
                      }`}
                    >
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Current Status */}
              <div className="mt-6 pt-6 border-t border-library-border">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-library-success rounded-full mr-2 animate-pulse"></div>
                  <span className="text-library-success font-medium">
                    Hiện tại đang mở cửa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="card-library text-center bg-library-surface">
          <div className="flex items-center justify-center mb-6">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-library-primary mr-3 w-8 h-8"
            />
            <h2 className="text-2xl font-heading font-semibold text-library-text-primary">
              Sứ Mệnh Của Chúng Tôi
            </h2>
          </div>
          <p className="text-lg text-library-text-secondary leading-relaxed max-w-4xl mx-auto">
            Góc Thư Viện là nơi tri thức thăng hoa và cộng đồng gắn kết. Chúng
            tôi cam kết mang đến không gian học tập lý tưởng, dịch vụ chuyên
            nghiệp và trải nghiệm đọc sách tuyệt vời nhất cho mọi độc giả.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <div>
              <div className="text-3xl font-bold text-library-primary mb-2">
                1,000+
              </div>
              <div className="text-library-text-muted">Đầu Sách</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-library-primary mb-2">
                50+
              </div>
              <div className="text-library-text-muted">Thành Viên</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-library-primary mb-2">
                5+
              </div>
              <div className="text-library-text-muted">Năm Hoạt Động</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-library-primary mb-2">
                24/7
              </div>
              <div className="text-library-text-muted">Hỗ Trợ</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-library-text-muted mb-6">
            Có câu hỏi hoặc cần hỗ trợ? Đừng ngần ngại liên hệ với chúng tôi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+84123456789"
              className="btn-library-primary flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Gọi ngay
            </a>
            <a
              href="mailto:info@gocthuvien.com"
              className="btn-library-secondary flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Gửi email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
