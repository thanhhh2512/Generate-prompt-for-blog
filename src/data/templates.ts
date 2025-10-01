import type { TemplateStyle } from '@/lib/types';

export const templates: TemplateStyle[] = [
    {
        id: 'inspirational',
        name: 'Cảm Hứng',
        description: 'Tiếp cận bằng cách kể chuyện với sự kết nối cảm xúc',
        structure: 'Bắt đầu với câu chuyện hoặc tình huống dễ hiểu, kết nối cảm xúc với đối tượng, trình bày khóa học như giải pháp cho hoài bão của họ, kết thúc bằng lời kêu gọi hành động đầy động lực'
    },
    {
        id: 'quick-benefits',
        name: 'Lợi Ích Nhanh',
        description: 'Định dạng vấn đề-giải pháp với các điểm nổi bật rõ ràng',
        structure: 'Xác định vấn đề hoặc thách thức phổ biến, trình bày khóa học như giải pháp, liệt kê các lợi ích chính bằng ký hiệu đầu dòng, đưa ra các bước tiếp theo rõ ràng'
    },
    {
        id: 'curiosity-driven',
        name: 'Tạo Tò Mò',
        description: 'Tiếp cận dựa trên câu hỏi để tạo ra sự quan tâm',
        structure: 'Bắt đầu với câu hỏi hấp dẫn, xây dựng sự tò mò về câu trả lời, tiết lộ cách khóa học cung cấp giải pháp, kết thúc bằng lời kêu gọi hành động thuyết phục'
    },
    {
        id: 'natural',
        name: 'Quảng cáo tự nhiên',
        description: 'Viết bằng giọng điệu tự nhiên, gần gũi như một người thật chia sẻ trải nghiệm hoặc quan sát chân thực. Tránh nghe như quảng cáo chính thức. Câu văn ngắn, thân thiện và dễ theo dõi',
        structure: 'Bắt đầu với câu chuyện cá nhân nhỏ, khoảnh khắc đời thường, hoặc quan sát thường ngày, bao gồm các chi tiết dễ đồng cảm. Kết nối câu chuyện đó với khóa học một cách tự nhiên, cho thấy khóa học tạo ra sự khác biệt trong cuộc sống thực. Làm nổi bật chi tiết khóa học (tên khóa học chính thức, ngày khai giảng, thời lượng, hình thức, lợi ích chính, link đăng ký). Thêm lời kêu gọi hành động rõ ràng (khuyến khích đăng ký). Luôn bao gồm hashtags ở cuối'
    },
    // NOTE: minimal change – appended marketing frameworks (AIDA, ABC, 3S, BAB, 4P, PAS).
    // Do not alter existing template ids or selection logic.
    {
        id: 'aida',
        name: 'AIDA',
        description: 'Mô hình kinh điển: Chú ý - Hứng thú - Mong muốn - Hành động.',
        structure: 'Attention (Chú ý): Thu hút sự chú ý bằng tiêu đề nổi bật hoặc nỗi đau khách hàng. ' +
            'Interest (Hứng thú): Cung cấp thông tin thú vị/số liệu/lợi ích đặc biệt để giữ chân. ' +
            'Desire (Mong muốn): Nhấn mạnh lợi ích khiến khách hàng tin rằng vấn đề của họ được giải quyết. ' +
            'Action (Hành động): CTA rõ ràng như "Đăng ký ngay", "Mua ngay", "Nhấp để nhận ưu đãi".'
    },
    {
        id: 'abc-checklist',
        name: 'ABC Checklist',
        description: 'Viết ngắn gọn, liệt kê lợi ích theo gạch đầu dòng, kết thúc bằng CTA rõ ràng.',
        structure: 'Liệt kê 3–6 lợi ích chính, mỗi dòng 1 ý ngắn, dễ đọc. ' +
            'Giữ luồng thông tin mạch lạc, rõ ràng. ' +
            'Cuối bài thêm thông tin liên hệ và CTA mạnh để người đọc hành động ngay.'
    },
    {
        id: 'three-s',
        name: '3S',
        description: 'Star – Story – Solution: kể chuyện xoay quanh một nhân vật đáng tin.',
        structure: 'Star (Ngôi sao): Giới thiệu nhân vật/dẫn chứng cụ thể. ' +
            'Story (Câu chuyện): Vấn đề và cao trào khiến người đọc đồng cảm. ' +
            'Solution (Giải pháp): Khóa học/sản phẩm là lời giải, kết thúc bằng CTA tự nhiên.'
    },
    {
        id: 'bab',
        name: 'BAB',
        description: 'Before – After – Bridge: nêu trạng thái trước/sau và cây cầu giải pháp.',
        structure: 'Before (Trước): Mô tả khó khăn trước khi dùng. ' +
            'After (Sau): Kết quả tích cực sau khi tham gia/áp dụng. ' +
            'Bridge (Cầu nối): Trình bày khóa học/sản phẩm như cầu nối tạo ra thay đổi, kèm CTA.'
    },
    {
        id: 'four-p',
        name: '4P',
        description: 'Picture – Promise – Prove – Push: hình ảnh, lời hứa, minh chứng, thúc đẩy.',
        structure: 'Picture: Mở đầu bằng hình ảnh/miêu tả sinh động để dừng lướt. ' +
            'Promise: Cam kết cụ thể, đáng tin. ' +
            'Prove: Số liệu/đánh giá/chứng thực củng cố niềm tin. ' +
            'Push: CTA dứt khoát khuyến khích đăng ký ngay.'
    },
    {
        id: 'pas',
        name: 'PAS',
        description: 'Problem – Agitation – Solution: nêu vấn đề, khuấy động, đưa giải pháp.',
        structure: 'Problem: Xác định vấn đề đúng "nỗi đau". ' +
            'Agitation: Khuấy động mức độ nghiêm trọng/hệ quả nếu chậm trễ. ' +
            'Solution: Khóa học/sản phẩm là giải pháp hiệu quả, đóng bằng CTA mạnh.'
    }
];