import type { EventTemplate } from '@/lib/types';

export const eventTemplates: EventTemplate[] = [
    {
        id: 'excitement',
        name: 'Tạo Sự Hứng Thú',
        description: 'Tạo sự phấn khích và mong đợi cho sự kiện với nội dung năng động',
        structure: 'Bắt đầu với hook thu hút (thống kê, câu hỏi, hoặc tuyên bố thú vị), giới thiệu sự kiện với những điểm nổi bật chính, nhấn mạnh giá trị và lợi ích tham gia, tạo cảm giác khan hiếm hoặc cấp bách, kết thúc bằng lời kêu gọi hành động mạnh mẽ'
    },
    {
        id: 'informative',
        name: 'Thông Tin Chi Tiết',
        description: 'Cung cấp thông tin đầy đủ và chi tiết về sự kiện một cách có tổ chức',
        structure: 'Mở đầu ngắn gọn về mục đích sự kiện, trình bày thông tin chi tiết (thời gian, địa điểm, chương trình), liệt kê các điểm nổi bật và lợi ích, thông tin về đối tượng tham gia và yêu cầu, hướng dẫn đăng ký rõ ràng'
    },
    {
        id: 'community-focused',
        name: 'Hướng Cộng Đồng',
        description: 'Tập trung vào việc xây dựng cộng đồng và kết nối giữa các thành viên',
        structure: 'Nhấn mạnh tính chất cộng đồng và kết nối, chia sẻ về cơ hội gặp gỡ và học hỏi từ nhau, giới thiệu các hoạt động tương tác và networking, tạo cảm giác thuộc về một nhóm/cộng đồng lớn hơn, khuyến khích chia sẻ và tham gia tích cực'
    },
    {
        id: 'benefit-driven',
        name: 'Tập Trung Lợi Ích',
        description: 'Nhấn mạnh vào những lợi ích cụ thể mà người tham gia sẽ nhận được',
        structure: 'Liệt kê rõ ràng những gì người tham gia sẽ đạt được, nhấn mạnh các ưu đãi đặc biệt (quà tặng, học bổng, cơ hội việc làm), so sánh trước và sau khi tham gia sự kiện, đưa ra bằng chứng cụ thể về giá trị (testimonial, số liệu), kêu gọi hành động dựa trên lợi ích'
    }
];