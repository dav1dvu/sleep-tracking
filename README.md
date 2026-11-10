# 🌙 SOMNA - Elite Circadian & Sleep Intelligence

> **Nền tảng theo dõi thời lượng giấc ngủ, tính chu kỳ 90 phút, phân tích nợ ngủ và Bác sĩ AI y học giấc ngủ chuẩn lâm sàng.**
> Được tối ưu hóa cho triển khai 1-chạm trên **Vercel** (`.vercel.app`) cùng trải nghiệm **PWA Mobile-First**.

---

## ✨ Điểm nổi bật & Tính năng cốt lõi

### 1. ⏱️ Bộ tính chu kỳ giấc ngủ 90 phút (Circadian 90-Minute Engine)
* **Quy luật 90 phút (Ultradian Rhythms)**: Phân tích 4 giai đoạn Ru ngủ (N1) $\rightarrow$ Ngủ nông (N2) $\rightarrow$ Ngủ sâu sóng chậm (N3 Slow-Wave Sleep) $\rightarrow$ Ngủ mơ (REM).
* **Tính toán 2 chiều**:
  * *Tôi muốn thức dậy lúc...* $\rightarrow$ Đề xuất các mốc giờ vàng nên đi ngủ (5 chu kỳ = 7.5h tối ưu, 6 chu kỳ = 9h ngủ bù, 4 chu kỳ = 6h bận rộn) có tính bù 14 phút độ trễ chìm vào giấc.
  * *Nếu tôi đi ngủ ngay bây giờ...* $\rightarrow$ Đề xuất giờ chuông báo thức reo ở cuối chu kỳ REM, loại bỏ hoàn toàn cảm giác choáng váng mệt mỏi (*Sleep Inertia*).

### 2. ☀️ Lịch trình Curfew sinh học (24-Hour Bio-Curfew)
* ☕ **Caffeine Cutoff**: Ngừng nạp caffeine trước giờ ngủ 10 tiếng để bảo vệ thụ thể Adenosine não bộ.
* 🍽️ **Dinner Curfew**: Kết thúc bữa tối nặng trước giờ ngủ 3.5 tiếng, chống trào ngược và giảm tải hệ tiêu hóa.
* 🏃 **Workout Curfew**: Kết thúc vận động nặng trước 2.5 tiếng để nhiệt độ cơ thể lõi hạ xuống.
* 📱 **Screen-Off & Melatonin Window**: Bật đèn vàng và giảm ánh sáng xanh trước 1 tiếng để tuyến tùng tiết Melatonin tự nhiên.

### 3. 📊 Dashboard KPI & Phân tích tương quan thói quen
* **4 Chỉ số chuẩn lâm sàng**:
  1. *Thời lượng trung bình (h)* so với mục tiêu vàng.
  2. *Nợ giấc ngủ (Sleep Debt - h)* tích lũy trong 7 ngày gần nhất & phác đồ bù nợ thông minh.
  3. *Chỉ số đều đặn (Sleep Regularity Index - SRI %)* đo độ lệch giờ ngủ giữa ngày thường và cuối tuần (*Social Jetlag*).
  4. *Mức năng lượng thức dậy (1-5★)* và thời gian chìm vào giấc (*Sleep Latency*).
* **Biểu đồ cột trực quan**: Tùy chọn 7 ngày / 14 ngày / 30 ngày, phân màu theo cấp độ chất lượng giấc ngủ (Ngọc lục bảo 5★, Chàm thiên hà 4★, Hổ phách 3★, Hồng san hô 1-2★).
* **Khoa học dữ liệu tương quan (Correlation Matrix)**: Nhận diện chính xác thói quen nào mang lại năng lượng cao nhất (Phòng mát 19-21°C, Thiền 4-7-8) và thói quen nào tàn phá giấc ngủ (Cà phê chiều, lướt điện thoại trên giường).
* **Bản đồ nhiệt 30 ngày (GitHub-style Sleep Heatmap)**: Theo dõi độ đủ giấc từng ngày trong tháng.

### 4. 🧘 Wind-Down Studio: Âm thanh ru ngủ & Hơi thở 4-7-8
* **100% Web Audio API Synthesizer (Hoạt động offline hoàn toàn, không tốn dung lượng tải tệp ngoài)**:
  * ☕ *Nhiễu Nâu (Brown Noise)*: Âm trầm ấm áp, cắt dải cao <450Hz, giảm suy nghĩ miên man.
  * 🌧️ *Mưa đêm yên bình (Ocean Rain)*: Bộ lọc Bandpass biến thiên 900Hz với hiệu ứng giọt mưa.
  * 🌊 *Sóng não Theta 6Hz (Binaural Beats)*: Kênh trái 196Hz - Kênh phải 202Hz kích thích đồng bộ sóng não vào trạng thái thư thái sâu.
  * 🍃 *Nhiễu Hồng (Pink Noise)* & ⚪ *Nhiễu Trắng (White Noise)*.
  * Bộ hẹn giờ tắt êm dịu (15p, 30p, 45p, 60p) với hiệu ứng fade-out âm lượng mượt mà.
* **Vòng tròn hướng dẫn nhịp thở 4-7-8**: Kỹ thuật kích hoạt hệ thần kinh phó giao cảm (Hít 4s $\rightarrow$ Giữ 7s $\rightarrow$ Thở 8s) với vòng hào quang mở rộng/co lại trực quan.
* **Worry Pad (Nhật ký xả lo âu)**: Nơi ghi chép những suy nghĩ trăn trở trước khi nhắm mắt kèm nút *"Đốt sạch lo âu"* để giải phóng vỏ não.

### 5. 🤖 Bác sĩ Giấc ngủ AI & Báo cáo tuần (NVIDIA Nemotron 3 Ultra 550B)
* Tích hợp **OpenRouter API** với mô hình `nvidia/nemotron-3-ultra-550b-a55b:free`.
* **Clinical Weekly Audit**: Tự động tổng hợp dữ liệu thực tế 7 ngày, tính điểm phục hồi (0-100), nhận diện Chronotype (Cú đêm 🦉 / Sơn ca 🐦 / Gấu 🐻), đưa ra nhận định y sinh và 3 hành động vi mô tối nay.
* **Hỏi đáp trực tiếp cùng Dr. Somna**: Trả lời mọi băn khoăn về giấc ngủ dựa trên sinh lý thần kinh học.

### 6. 🪪 Thẻ chia sẻ Sleep Wrapped (Phong cách Spotify Wrapped)
* Tạo thẻ tổng kết thiết kế sang trọng dạng dọc (tỷ lệ chuẩn Story Instagram/Facebook).
* Xuất file ảnh PNG chất lượng cao chỉ với 1 click (`html-to-image`) kèm hiệu ứng pháo hoa (`canvas-confetti`).

### 7. 📱 PWA & Màn hình ngủ OLED Pitch Black (Zen Mode)
* **Zen Sleep Mode**: Màn hình đồng hồ số màu hổ phách dịu mắt trên nền đen tuyệt đối `#000000`, không làm ức chế Melatonin, đếm thời gian ngủ trực tiếp và chuyển tiếp 1 chạm sang đánh giá thức dậy.
* **Progressive Web App (PWA)**: Hỗ trợ "Thêm vào màn hình chính" (Add to Home Screen) trên iPhone và Android, chạy độc lập không thanh trình duyệt, hoạt động offline qua Service Worker & LocalStorage.

---

## 🛠️ Công nghệ sử dụng

| Lớp | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Tối ưu hóa tốc độ prerender tĩnh và serverless dynamic route trên Vercel. |
| **Ngôn ngữ** | **TypeScript 5 (Strict Mode)** | An toàn kiểu dữ liệu 100%, 0 lỗi biên dịch. |
| **Styling** | **Tailwind CSS v4** | Hệ thống màu OLED Pitch Black, Glassmorphism và animation hơi thở. |
| **Âm thanh** | **Web Audio API Native** | Không tốn băng thông, tính toán dao động sóng và bộ lọc âm thanh thời gian thực. |
| **Biểu đồ & UI** | **Custom Scalable SVG + Lucide Icons** | Siêu nhẹ, phản hồi tức thì, không bị lỗi SSR hydration. |
| **AI Engine** | **OpenRouter API** | Model `nvidia/nemotron-3-ultra-550b-a55b:free` tư vấn chuyên sâu. |
| **Offline Cache** | **LocalStorage + Service Worker** | Lưu trữ cục bộ an toàn, bảo mật dữ liệu riêng tư của người dùng. |

---

## 🚀 Hướng dẫn chạy cục bộ

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo tệp cấu hình môi trường .env.local
cp .env.example .env.local

# 3. Chạy môi trường phát triển
npm run dev

# Mở trình duyệt tại: http://localhost:3000
```

---

## 🌐 Triển khai lên Vercel trong 1 phút

1. Đẩy mã nguồn lên tài khoản GitHub của bạn.
2. Truy cập [vercel.com](https://vercel.com) $\rightarrow$ Chọn **Add New Project** $\rightarrow$ Chọn repository `sleep-tracking`.
3. Thêm biến môi trường trong mục **Environment Variables**:
   * `OPENROUTER_API_KEY`: Mã khóa OpenRouter của bạn.
   * `OPENROUTER_MODEL`: `nvidia/nemotron-3-ultra-550b-a55b:free`
4. Bấm **Deploy** $\rightarrow$ Trang web sẵn sàng hoạt động tại `https://your-domain.vercel.app`!

---

*Phát triển với sự chú trọng tối đa về trải nghiệm người dùng, độ chính xác y sinh và tính thực tiễn hàng ngày.*
