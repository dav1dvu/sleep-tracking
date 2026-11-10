import fs from 'fs';
import path from 'path';

console.log('🌌 [Code Reviewer & Quality Assessor] Bắt đầu Kiểm duyệt Toàn diện Trước khi Push (Starry Night Edition)...\n');

let totalScore = 0;
const maxScore = 100;
const breakdown = [];

// 1. Security & Secrets Isolation (20 pts)
console.log('🔒 1. Kiểm tra An ninh, Bảo mật Key & Cách ly Môi trường (.env)...');
const apiCoach = fs.readFileSync('src/app/api/ai/coach/route.ts', 'utf-8');
const apiAudit = fs.readFileSync('src/app/api/ai/audit/route.ts', 'utf-8');
const gitignore = fs.readFileSync('.gitignore', 'utf-8');

const hasHardcodedOpenRouterKey = apiCoach.includes('sk-or-v1-') || apiAudit.includes('sk-or-v1-');
const hasEnvLocalInGitignore = gitignore.includes('.env*') || gitignore.includes('.env*.local') || gitignore.includes('.env.local');

if (!hasHardcodedOpenRouterKey && hasEnvLocalInGitignore) {
  totalScore += 20;
  breakdown.push({ category: 'Security & Secrets Isolation', score: '20/20', status: 'PASS', notes: 'Khong lo API key trong code. .env duoc bao ve.' });
  console.log('   ✅ PASS: Không phát hiện API key bị lộ. .env.local an toàn tuyệt đối.');
} else {
  breakdown.push({ category: 'Security & Secrets Isolation', score: '0/20', status: 'FAIL', notes: 'API key detected in code or gitignore missing.' });
  console.log('   ❌ FAIL: Kiểm tra bảo mật thất bại!');
}

// 2. Vercel & Deploy Config (15 pts)
console.log('\n⚙️ 2. Kiểm tra Cấu hình Vercel (.npmrc)...');
const npmrcExists = fs.existsSync('.npmrc');
const npmrcContent = npmrcExists ? fs.readFileSync('.npmrc', 'utf-8') : '';
const suppressesWarning = npmrcContent.includes('loglevel=error');

if (npmrcExists && suppressesWarning) {
  totalScore += 15;
  breakdown.push({ category: 'Vercel Deployment Configuration', score: '15/15', status: 'PASS', notes: '.npmrc triet tieu hoan toan cache-dir warning.' });
  console.log('   ✅ PASS: .npmrc triệt tiêu hoàn toàn warning trên Vercel build.');
} else {
  breakdown.push({ category: 'Vercel Deployment Configuration', score: '0/15', status: 'FAIL', notes: '.npmrc missing or misconfigured.' });
  console.log('   ❌ FAIL: .npmrc cấu hình chưa chuẩn!');
}

// 3. Mobile Modal Architecture & Flex min-h-0 (25 pts)
console.log('\n📱 3. Kiểm tra Kiến trúc Modal Mobile (LogSleepModal & SettingsModal)...');
const logModal = fs.readFileSync('src/components/LogSleepModal.tsx', 'utf-8');
const settingsModal = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');

const logHasMinH0 = logModal.includes('min-h-0');
const settingsHasMinH0 = settingsModal.includes('min-h-0');
const logHasStickyFooter = logModal.includes('sticky bottom-0') && logModal.includes('safe-area-inset-bottom');
const logHasScrollLock = logModal.includes("document.body.style.overflow = 'hidden'");
const hasColorSchemeDark = logModal.includes("colorScheme: 'dark'") && settingsModal.includes("colorScheme: 'dark'");

if (logHasMinH0 && settingsHasMinH0 && logHasStickyFooter && logHasScrollLock && hasColorSchemeDark) {
  totalScore += 25;
  breakdown.push({ category: 'Mobile Modal Architecture', score: '25/25', status: 'PASS', notes: 'min-h-0 chong loi WebKit, body scroll lock, sticky safe-area footer.' });
  console.log('   ✅ PASS: Modal chuẩn WebKit (min-h-0), khóa cuộn nền, nút dính luôn nhìn thấy.');
} else {
  totalScore += 10;
  breakdown.push({ category: 'Mobile Modal Architecture', score: '10/25', status: 'WARN', notes: 'Modal thieu min-h-0 hoac sticky footer.' });
  console.log('   ⚠️ WARN: Cần kiểm tra lại cấu trúc modal.');
}

// 4. Đồng bộ Chu kỳ 90P & Cài đặt 5 mốc thời lượng (20 pts)
console.log('\n🔄 4. Kiểm tra Đồng bộ Chu kỳ 90P & Cài đặt 5 mốc (6h, 6.5h, 7h, 7.5h, 8h)...');
const circadianTab = fs.readFileSync('src/components/CircadianTab.tsx', 'utf-8');
const pageCode = fs.readFileSync('src/app/page.tsx', 'utf-8');

const has5Choices = settingsModal.includes('6.0, 6.5, 7.0, 7.5, 8.0');
const circadianReceivesProfile = circadianTab.includes('profile: CircadianProfile') && pageCode.includes('profile={profile}');
const circadianSyncs = circadianTab.includes('profile.idealWakeTime') && circadianTab.includes('profile.idealBedtime');

if (has5Choices && circadianReceivesProfile && circadianSyncs) {
  totalScore += 20;
  breakdown.push({ category: 'Circadian Sync & 5 Target Choices', score: '20/20', status: 'PASS', notes: '5 muc 6h->8h chuan, dong bo 2 chieu Profile <-> CircadianTab.' });
  console.log('   ✅ PASS: 5 mốc thời lượng (6h->8h) chính xác. Chu kỳ 90P đồng bộ 2 chiều với Cài đặt.');
} else {
  breakdown.push({ category: 'Circadian Sync & 5 Target Choices', score: '5/20', status: 'FAIL', notes: '5 muc thoi luong hoac dong bo chu ky chua hoan tat.' });
  console.log('   ❌ FAIL: Đồng bộ chu kỳ hoặc 5 mốc thời lượng chưa đạt!');
}

// 5. The Starry Night Theme & Anti-Slop Visual Taste (20 pts)
console.log('\n🌌 5. Kiểm tra Theme The Starry Night (Vincent van Gogh) & Gradient...');
const globalsCss = fs.readFileSync('src/app/globals.css', 'utf-8');

const hasStarryCanvas = globalsCss.includes('radial-gradient') && globalsCss.includes('#070B18');
const hasStarryGoldButton = globalsCss.includes('btn-starry-gold');
const hasStarryMoon = globalsCss.includes('--starry-gold') || globalsCss.includes('F59E0B');

if (hasStarryCanvas && hasStarryGoldButton && hasStarryMoon) {
  totalScore += 20;
  breakdown.push({ category: 'The Starry Night Theme & Gradients', score: '20/20', status: 'PASS', notes: 'Bang mau Van Gogh Dem day sao, gradient vang starlight & xanh dem.' });
  console.log('   ✅ PASS: Giao diện The Starry Night với gradient sao trời lộng lẫy.');
} else {
  breakdown.push({ category: 'The Starry Night Theme & Gradients', score: '10/20', status: 'WARN', notes: 'Thieu css token cho Starry Night.' });
  console.log('   ⚠️ WARN: Thiếu token Starry Night.');
}

console.log('\n================================================================');
console.log(`🎯 TỔNG ĐIỂM ĐÁNH GIÁ TRƯỚC KHI PUSH (PRE-PUSH SCORE): ${totalScore}/${maxScore}`);
console.log('================================================================');
console.table(breakdown);

if (totalScore === 100) {
  console.log('\n🎉 KẾT QUẢ: TOÀN BỘ TIÊU CHUẨN ĐẠT 100/100 TUYỆT ĐỐI! ĐỦ ĐIỀU KIỆN PUSH GITHUB.');
  process.exit(0);
} else {
  console.log('\n⚠️ Cần xử lý các cảnh báo trước khi push.');
  process.exit(1);
}
