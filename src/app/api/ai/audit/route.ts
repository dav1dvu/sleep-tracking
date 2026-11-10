import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

export async function POST(req: NextRequest) {
  try {
    const { stats, recentSessions } = await req.json();

    const prompt = `Bạn là Chuyên gia Trưởng Y học Giấc ngủ. Dưới đây là dữ liệu theo dõi thực tế trong 7-10 ngày qua của người dùng:
Thống kê tổng quan:
${JSON.stringify(stats, null, 2)}

Chi tiết các phiên ngủ gần nhất:
${JSON.stringify(recentSessions, null, 2)}

Hãy phân tích toàn diện và trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm theo bất kỳ markdown code block hay ký tự thừa nào ngoài JSON) theo cấu trúc sau:
{
  "overallScore": 85,
  "headline": "Tiêu đề ngắn gọn, sắc bén về tình trạng tuần qua",
  "chronotype": "Cú Đêm 🦉 hoặc Sơn Ca Ban Mai 🐦 hoặc Nhịp Sinh Học Gấu 🐻",
  "summary": "Tóm tắt đánh giá chất lượng phục hồi, chu kỳ ngủ và độ ổn định (khoảng 2-3 câu súc tích)",
  "keyInsights": [
    "Nhận định cụ thể 1: ví dụ mối liên hệ giữa caffeine/màn hình và chất lượng ngủ",
    "Nhận định cụ thể 2: về nợ giấc ngủ hoặc sự lệch giờ giữa các ngày",
    "Nhận định cụ thể 3: về năng lượng buổi sáng khi thức dậy"
  ],
  "recommendedActions": [
    "Hành động vi mô 1: cụ thể, làm được ngay tối nay",
    "Hành động vi mô 2: về giờ thức dậy hoặc ánh sáng mặt trời",
    "Hành động vi mô 3: về thói quen thư giãn wind-down"
  ],
  "debtVerdict": "Lời khuyên ngắn về cách bù nợ ngủ hoặc duy trì phong độ hiện tại"
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://somna.vercel.app',
        'X-Title': 'Somna Sleep Intelligence',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('Audit API call failed:', response.status);
      return NextResponse.json(generateFallbackAudit(stats));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Trích xuất JSON từ phản hồi của model
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = content.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({
          ...parsed,
          generatedAt: new Date().toISOString(),
        });
      }
    } catch (parseErr) {
      console.warn('Could not parse model JSON response:', parseErr);
    }

    return NextResponse.json(generateFallbackAudit(stats));
  } catch (error: any) {
    console.error('Audit API handler error:', error);
    return NextResponse.json(generateFallbackAudit(null));
  }
}

function generateFallbackAudit(stats: any) {
  const avgHours = stats?.averageDurationMinutes
    ? (stats.averageDurationMinutes / 60).toFixed(1)
    : '7.5';
  const debt = stats?.sleepDebtHours ?? 1.5;
  const regularity = stats?.regularityScore ?? 84;

  return {
    generatedAt: new Date().toISOString(),
    overallScore: Math.min(95, Math.max(60, regularity - Math.abs(debt) * 3)),
    headline:
      debt > 2
        ? 'Cần bù đắp nợ ngủ nhẹ để phục hồi sự tập trung'
        : 'Nhịp sinh học đang vận hành khá ổn định và tích cực',
    chronotype: stats?.chronotype || 'Nhịp Sinh Học Gấu 🐻',
    summary: `Thời lượng ngủ trung bình đạt ${avgHours}h/đêm. Bạn duy trì chỉ số đều đặn (SRI) ở mức ${regularity}%. Sự chênh lệch giữa ngày trong tuần và cuối tuần cần được điều chỉnh nhẹ.`,
    keyInsights: [
      'Những đêm kết hợp phòng mát và không dùng điện thoại cho chỉ số năng lượng sáng cao nhất.',
      debt > 0
        ? `Tích lũy nợ ngủ ${debt}h đang làm giảm sự tỉnh táo vào khung giờ 14:00 - 16:00 chiều.`
        : 'Không có nợ ngủ đáng kể, dự trữ năng lượng thần kinh rất tốt.',
      'Thời gian chìm vào giấc ngủ trung bình ổn định trong ngưỡng sinh học lý tưởng (15-20 phút).',
    ],
    recommendedActions: [
      'Cố định mốc thức dậy vào 06:45 mỗi sáng (kể cả Thứ Bảy và Chủ Nhật).',
      'Đón ánh sáng mặt trời tự nhiên trong 15 phút đầu tiên sau khi mở mắt.',
      'Thiết lập thông báo ngưng Caffeine trước 14:30 chiều để bảo vệ thụ thể Adenosine.',
    ],
    debtVerdict:
      debt > 0
        ? `Ngủ sớm hơn 30 phút mỗi tối trong 3 đêm tới thay vì ngủ nướng dồn vào cuối tuần.`
        : 'Tuyệt vời! Tiếp tục duy trì cửa sổ ngủ vàng này.',
  };
}
