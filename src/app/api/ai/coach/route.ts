import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();

    const systemPrompt = `Bạn là Dr. Somna, chuyên gia y học giấc ngủ và nhịp sinh học hàng đầu (Chronobiologist & Sleep Science Expert).
Nhiệm vụ của bạn là tư vấn, giải thích và đưa ra lời khuyên khoa học, thực tế, ân cần và dễ hiểu cho người dùng về giấc ngủ.

Ngữ cảnh thực tế của người dùng hiện tại:
${userContext ? JSON.stringify(userContext, null, 2) : 'Chưa có dữ liệu phiên ngủ cụ thể.'}

Nguyên tắc trả lời:
- Luôn dựa trên khoa học thần kinh (chu kỳ 90 phút, Adenosine, Melatonin, Cortisol, Circadian rhythm).
- Trả lời bằng tiếng Việt chuẩn xác, ngắn gọn, truyền cảm hứng, định dạng Markdown rõ ràng (sử dụng bullet points, in đậm từ khóa).
- Không phán xét hay đao to búa lớn; đưa ra giải pháp thực tiễn từng bước nhỏ (Micro-habits) có thể làm được ngay tối nay.`;

    const openRouterMessages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(messages) ? messages : []),
    ];

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
        messages: openRouterMessages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', response.status, errText);
      return NextResponse.json(
        {
          error: 'OpenRouter rate limit or model busy',
          reply:
            'Hiện tại máy chủ AI đang xử lý lượng lớn yêu cầu. Dựa trên số liệu của bạn: Hãy ưu tiên duy trì giờ thức dậy cố định vào buổi sáng (ngay cả cuối tuần) để neo chặt nhịp sinh học Circadian!',
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      'Xin lỗi, tôi chưa thể hoàn thành câu trả lời. Hãy thử hỏi lại nhé!';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('AI Coach endpoint error:', error);
    return NextResponse.json(
      {
        error: error.message,
        reply:
          'Để có giấc ngủ phục hồi tốt nhất đêm nay, hãy hạn chế nhìn màn hình trước khi ngủ 45 phút và giữ phòng ngủ mát mẻ khoảng 20-22°C nhé.',
      },
      { status: 200 }
    );
  }
}
