import { SleepSession, SleepStats, SleepTag, SleepTagId } from '@/types/sleep';

export const SLEEP_TAGS: SleepTag[] = [
  {
    id: 'caffeine_late',
    label: 'Cà phê sau 15:00',
    icon: 'Coffee',
    type: 'negative',
    impactHint: 'Caffeine chặn thụ thể Adenosine, làm chậm giấc ngủ sâu đến 45 phút.',
  },
  {
    id: 'screen_bed',
    label: 'Dùng đ/thoại trên giường',
    icon: 'Smartphone',
    type: 'negative',
    impactHint: 'Ánh sáng xanh ức chế tiết hormone Melatonin tự nhiên.',
  },
  {
    id: 'alcohol',
    label: 'Rượu / Bia buổi tối',
    icon: 'Wine',
    type: 'negative',
    impactHint: 'Gây ngủ chập chờn, phân mảnh giai đoạn REM và mất nước.',
  },
  {
    id: 'workout_late',
    label: 'Tập gym quá muộn',
    icon: 'Dumbbell',
    type: 'negative',
    impactHint: 'Tăng nhiệt độ cơ thể lõi và Cortisol, khó hạ nhịp tim.',
  },
  {
    id: 'heavy_meal',
    label: 'Ăn tối quá no',
    icon: 'Utensils',
    type: 'negative',
    impactHint: 'Hệ tiêu hóa hoạt động suốt đêm gây trào ngược và giảm chất lượng giấc ngủ.',
  },
  {
    id: 'high_stress',
    label: 'Áp lực / Lo âu',
    icon: 'AlertCircle',
    type: 'negative',
    impactHint: 'Kích hoạt hệ thần kinh giao cảm (Fight-or-Flight), làm tăng độ trễ giấc ngủ.',
  },
  {
    id: 'meditation',
    label: 'Thiền / Hít thở 4-7-8',
    icon: 'Sparkles',
    type: 'positive',
    impactHint: 'Kích hoạt hệ thần kinh đối giao cảm, hạ nhịp tim dưới 60 bpm.',
  },
  {
    id: 'reading',
    label: 'Đọc sách giấy',
    icon: 'BookOpen',
    type: 'positive',
    impactHint: 'Làm dịu mắt, chuyển não sang trạng thái sóng Alpha thư thái.',
  },
  {
    id: 'room_cool',
    label: 'Phòng mát (19-21°C)',
    icon: 'ThermometerSnowflake',
    type: 'positive',
    impactHint: 'Giúp nhiệt độ lõi cơ thể hạ xuống, kích hoạt giấc ngủ sâu (Deep Sleep).',
  },
  {
    id: 'shower_warm',
    label: 'Tắm nước ấm trước 1h',
    icon: 'Droplets',
    type: 'positive',
    impactHint: 'Tạo hiệu ứng giãn mạch ngoại vi, giúp cơ thể hạ nhiệt nhanh sau tắm.',
  },
  {
    id: 'melatonin',
    label: 'Melatonin / Magie',
    icon: 'Pill',
    type: 'neutral',
    impactHint: 'Bổ sung vi chất hỗ trợ nhịp sinh học và giãn cơ bắp.',
  },
  {
    id: 'earplugs',
    label: 'Nút bịt tai / Bịt mắt',
    icon: 'Shield',
    type: 'positive',
    impactHint: 'Cách ly 100% tiếng ồn và ô nhiễm ánh sáng ngoài ý muốn.',
  },
];

export interface SleepCycleOption {
  cycles: number;
  durationMinutes: number;
  timeString: string; // HH:mm
  description: string;
  recommendedTag?: 'Tối ưu nhất' | 'Khuyên dùng' | 'Tối thiểu' | 'Ngủ bù';
  isOptimal?: boolean;
}

/**
 * Tính các mốc giờ đi ngủ tối ưu từ giờ muốn thức dậy (theo chu kỳ 90 phút + 14 phút ru ngủ)
 */
export function calculateBedtimesFromWakeTime(wakeTimeStr: string): SleepCycleOption[] {
  const [wakeH, wakeM] = wakeTimeStr.split(':').map(Number);
  const wakeDate = new Date();
  wakeDate.setHours(wakeH, wakeM, 0, 0);

  // 1 chu kỳ = 90 phút. Buffer ngủ = 14 phút.
  const cycleCounts = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

  return cycleCounts.map((cycles) => {
    const totalMinutes = cycles * 90 + 14;
    const bedtime = new Date(wakeDate.getTime() - totalMinutes * 60 * 1000);
    const timeString = `${String(bedtime.getHours()).padStart(2, '0')}:${String(bedtime.getMinutes()).padStart(2, '0')}`;

    let description = '';
    let recommendedTag: SleepCycleOption['recommendedTag'];
    let isOptimal = false;

    if (cycles === 5) {
      description = '5 chu kỳ (7h30p) - Chuẩn vàng hồi phục năng lượng & trí nhớ cho hầu hết mọi người.';
      recommendedTag = 'Tối ưu nhất';
      isOptimal = true;
    } else if (cycles === 6) {
      description = '6 chu kỳ (9h00p) - Phục hồi sâu cho người vận động mạnh hoặc đang thiếu ngủ dài ngày.';
      recommendedTag = 'Ngủ bù';
    } else if (cycles === 4) {
      description = '4 chu kỳ (6h00p) - Đủ chu kỳ cho ngày bận rộn, không bị đau đầu khi thức dậy.';
      recommendedTag = 'Khuyên dùng';
    } else {
      description = '3 chu kỳ (4h30p) - Mức tối thiểu tạm thời, chỉ dùng trong trường hợp khẩn cấp.';
      recommendedTag = 'Tối thiểu';
    }

    return {
      cycles,
      durationMinutes: cycles * 90,
      timeString,
      description,
      recommendedTag,
      isOptimal,
    };
  });
}

/**
 * Tính các mốc giờ thức dậy tối ưu nếu đi ngủ ngay bây giờ
 */
export function calculateWakeTimesFromNow(fromDate: Date = new Date()): SleepCycleOption[] {
  const fallAsleepBuffer = 14; // phút
  const cycleCounts = [3, 4, 5, 6];

  return cycleCounts.map((cycles) => {
    const totalMinutes = fallAsleepBuffer + cycles * 90;
    const wakeDate = new Date(fromDate.getTime() + totalMinutes * 60 * 1000);
    const timeString = `${String(wakeDate.getHours()).padStart(2, '0')}:${String(wakeDate.getMinutes()).padStart(2, '0')}`;

    let description = '';
    let recommendedTag: SleepCycleOption['recommendedTag'];
    let isOptimal = false;

    if (cycles === 5) {
      description = '5 chu kỳ (7h30p ngủ thực) - Trạng thái tỉnh táo và sáng suốt đỉnh cao.';
      recommendedTag = 'Tối ưu nhất';
      isOptimal = true;
    } else if (cycles === 6) {
      description = '6 chu kỳ (9h00p ngủ thực) - Đầy đủ mọi giai đoạn Deep Sleep và REM phục hồi.';
      recommendedTag = 'Ngủ bù';
    } else if (cycles === 4) {
      description = '4 chu kỳ (6h00p ngủ thực) - Chu kỳ chuẩn, thức giấc tự nhiên.';
      recommendedTag = 'Khuyên dùng';
    } else {
      description = '3 chu kỳ (4h30p ngủ thực) - Giúp tỉnh táo ngắn hạn mà không bị mê sảng.';
      recommendedTag = 'Tối thiểu';
    }

    return {
      cycles,
      durationMinutes: cycles * 90,
      timeString,
      description,
      recommendedTag,
      isOptimal,
    };
  });
}

/**
 * Tính lịch trình Curfew (giờ giới hạn sinh học) từ giờ ngủ mục tiêu
 */
export function calculateCurfewTimeline(bedtimeStr: string) {
  const [bedH, bedM] = bedtimeStr.split(':').map(Number);
  const now = new Date();
  const bedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), bedH, bedM, 0, 0);

  const formatOffset = (hoursBefore: number) => {
    const d = new Date(bedDate.getTime() - hoursBefore * 60 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return [
    {
      label: 'Dừng nạp Caffeine & Trà',
      time: formatOffset(10),
      hoursBefore: 10,
      icon: 'Coffee',
      color: 'amber',
      tip: 'Khoảng 1/4 lượng caffeine vẫn còn trong não sau 10-12 tiếng.',
    },
    {
      label: 'Bữa tối nặng cuối cùng',
      time: formatOffset(3.5),
      hoursBefore: 3.5,
      icon: 'Utensils',
      color: 'orange',
      tip: 'Để dạ dày hoàn tất tiêu hóa, tránh trào ngược khi nằm ngửa.',
    },
    {
      label: 'Kết thúc tập luyện cường độ cao',
      time: formatOffset(2.5),
      hoursBefore: 2.5,
      icon: 'Dumbbell',
      color: 'blue',
      tip: 'Nhiệt độ cơ thể cần 2 tiếng để giảm về mức sẵn sàng cho giấc ngủ.',
    },
    {
      label: 'Tắt màn hình xanh & Bật đèn vàng',
      time: formatOffset(1),
      hoursBefore: 1,
      icon: 'EyeOff',
      color: 'indigo',
      tip: 'Tín hiệu kích hoạt tuyến tùng tiết Melatonin làm mắt díu lại.',
    },
    {
      label: 'Cửa sổ chìm vào giấc ngủ',
      time: bedtimeStr,
      hoursBefore: 0,
      icon: 'Moon',
      color: 'purple',
      tip: 'Nhắm mắt và hít thở nhịp nhàng, bắt đầu chu kỳ giấc ngủ đầu tiên.',
    },
  ];
}

/**
 * Tính toán toàn bộ thống kê & KPI từ danh sách phiên ngủ
 */
export function computeSleepStats(
  sessions: SleepSession[],
  targetHours: number = 8.0
): SleepStats {
  if (sessions.length === 0) {
    return {
      averageDurationMinutes: 0,
      totalSessions: 0,
      sleepDebtHours: 0,
      regularityScore: 100,
      averageQuality: 0,
      averageEnergy: 0,
      averageLatency: 0,
      chronotype: 'Nhịp Sinh Học Gấu 🐻',
    };
  }

  const targetMinutes = targetHours * 60;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const avgDuration = Math.round(totalMinutes / sessions.length);

  // Tính nợ giấc ngủ (tổng thiếu hụt so với mục tiêu trong 7 ngày gần nhất)
  const recentSessions = sessions.slice(0, 7);
  const debtMinutes = recentSessions.reduce((acc, s) => {
    return acc + (targetMinutes - s.durationMinutes);
  }, 0);
  const sleepDebtHours = Number((debtMinutes / 60).toFixed(1));

  // Tính Sleep Regularity Index (độ đồng đều của giờ đi ngủ)
  let bedtimeVariances = 0;
  const bedMinutesList = sessions.map((s) => {
    const d = new Date(s.bedtime);
    let mins = d.getHours() * 60 + d.getMinutes();
    // Chuẩn hóa giờ đi ngủ qua đêm: 00:00 - 04:00 tính là 24:00 - 28:00
    if (mins < 360) mins += 1440;
    return mins;
  });

  const avgBedMinutes =
    bedMinutesList.reduce((acc, m) => acc + m, 0) / bedMinutesList.length;

  bedMinutesList.forEach((m) => {
    bedtimeVariances += Math.pow(m - avgBedMinutes, 2);
  });
  const stdDevMinutes = Math.sqrt(bedtimeVariances / bedMinutesList.length);
  // StdDev 0 phút = 100%, StdDev 120 phút = 50%
  const regularityScore = Math.max(
    40,
    Math.min(100, Math.round(100 - (stdDevMinutes / 120) * 50))
  );

  // Trung bình chất lượng và năng lượng
  const avgQuality = Number(
    (sessions.reduce((acc, s) => acc + s.quality, 0) / sessions.length).toFixed(1)
  );
  const avgEnergy = Number(
    (sessions.reduce((acc, s) => acc + s.energyLevel, 0) / sessions.length).toFixed(1)
  );
  const avgLatency = Math.round(
    sessions.reduce((acc, s) => acc + s.latencyMinutes, 0) / sessions.length
  );

  // Tìm đêm ngủ tuyệt vời nhất (chất lượng cao nhất + thời lượng tốt)
  const bestSession = [...sessions].sort(
    (a, b) => b.quality * 100 + b.durationMinutes - (a.quality * 100 + a.durationMinutes)
  )[0];

  // Phân loại Chronotype
  let chronotype: SleepStats['chronotype'] = 'Nhịp Sinh Học Gấu 🐻';
  if (avgBedMinutes >= 24 * 60) {
    chronotype = 'Cú Đêm 🦉';
  } else if (avgBedMinutes <= 22 * 60 + 30) {
    chronotype = 'Sơn Ca Ban Mai 🐦';
  }

  return {
    averageDurationMinutes: avgDuration,
    totalSessions: sessions.length,
    sleepDebtHours,
    regularityScore,
    averageQuality: avgQuality,
    averageEnergy: avgEnergy,
    averageLatency: avgLatency,
    bestNightDate: bestSession?.date,
    chronotype,
  };
}
