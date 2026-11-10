import fs from 'fs';
import path from 'path';

console.log('🔍 [UI Visual Validator] Bắt đầu chấm điểm giao diện di động & Anti-Slop (Chuẩn HIG/Material)...');

const componentsDir = path.resolve('src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let totalButtonCount = 0;
let smallButtonCount = 0;
let tinyTextCount = 0;
let aiSlopWordsCount = 0;
let details = [];

const AI_SLOP_PHRASES = [
  'Khoa học Nhịp sinh học & Chu kỳ Ultradian',
  'Hệ thống đang ghi nhận thời gian ngủ',
  '100% âm thanh được tính toán và tổng hợp trực tiếp',
  'Đồng bộ hóa bán cầu não',
  'Kích hoạt hệ thần kinh phó giao cảm',
  'tàn phá giấc ngủ',
];

files.forEach(file => {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
  
  // 1. Kiểm tra chữ quá bé (<12px)
  const tinyMatches = content.match(/text-\[10px\]|text-\[11px\]/g);
  if (tinyMatches) {
    tinyTextCount += tinyMatches.length;
    details.push(`❌ ${file}: Còn ${tinyMatches.length} chữ siêu bé (10-11px).`);
  }

  // 2. Kiểm tra AI Cliché / Slop phrases
  AI_SLOP_PHRASES.forEach(phrase => {
    if (content.includes(phrase)) {
      aiSlopWordsCount++;
      details.push(`❌ ${file}: Chứa cụm từ AI dài dòng: "${phrase}".`);
    }
  });

  // 3. Phân tích các thẻ <button ...>
  const buttonTags = content.match(/<button[\s\S]*?>/g) || [];
  buttonTags.forEach(btn => {
    totalButtonCount++;
    // Nếu button có class padding quá bé (p-1, py-1, py-1.5, h-6, h-7) mà không có h-9..h-14
    if (btn.match(/\b(p-1|p-1\.5|py-1|py-1\.5|h-6|h-7|h-8)\b/) && !btn.match(/\b(h-9|h-10|h-11|h-12|h-13|h-14|h-16|min-h-\[44px\])\b/)) {
      smallButtonCount++;
      details.push(`⚠️ ${file}: Button có touch target bé (<44px): ${btn.substring(0, 60)}...`);
    }
  });
});

console.log('\n📊 THỐNG KÊ CHI TIẾT GIAO DIỆN DI ĐỘNG:');
console.log(`- Tổng số nút tương tác (Buttons): ${totalButtonCount}`);
console.log(`- Nút có touch-target nhỏ (<44px/h-9): ${smallButtonCount}`);
console.log(`- Vị trí chữ quá bé (<12px): ${tinyTextCount}`);
console.log(`- Cụm từ rườm rà / AI Slop: ${aiSlopWordsCount}`);

const baseScore = 100 - (tinyTextCount * 5) - (aiSlopWordsCount * 10) - (smallButtonCount * 3);
const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

console.log(`\n🏆 ĐIỂM SỐ CHUẨN UX DI ĐỘNG & ANTI-SLOP: ${finalScore}/100`);

if (finalScore >= 95) {
  console.log('🌟 Đạt chứng nhận: Trải nghiệm Di Động Đỉnh Cao (AAA Grade Mobile Experience)!');
} else if (finalScore >= 80) {
  console.log('✅ Đạt tiêu chuẩn trải nghiệm di động tốt.');
} else {
  console.log('❌ Cần tiếp tục tối ưu hóa!');
  details.forEach(d => console.log('  ' + d));
}
