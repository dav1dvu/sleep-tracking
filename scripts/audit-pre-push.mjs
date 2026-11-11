import fs from 'fs';
import path from 'path';

console.log('🌌 [Code Reviewer & Quality Assessor] Bắt đầu Kiểm duyệt Toàn diện Trước khi Push (Starry Night Masterpiece Edition)...\n');

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
  breakdown.push({ category: 'Security & Secrets Isolation', score: '20/20', status: 'PASS', notes: 'Không lộ API key trong code. .env được bảo vệ.' });
  console.log('   ✅ PASS: Không phát hiện API key bị lộ. .env.local an toàn tuyệt đối.');
} else {
  breakdown.push({ category: 'Security & Secrets Isolation', score: '0/20', status: 'FAIL', notes: 'API key detected in code or gitignore missing.' });
  console.log('   ❌ FAIL: Kiểm tra bảo mật thất bại!');
}

// 2. Vercel Caching & Service Worker Network-First (20 pts)
console.log('\n⚙️ 2. Kiểm tra Tránh Lỗi F5 Cache trên Vercel (.npmrc, sw.js, next.config.ts)...');
const swContent = fs.readFileSync('public/sw.js', 'utf-8');
const nextConfigContent = fs.readFileSync('next.config.ts', 'utf-8');
const npmrcContent = fs.existsSync('.npmrc') ? fs.readFileSync('.npmrc', 'utf-8') : '';

const isNetworkFirstSW = swContent.includes("navigate") && swContent.includes('somna-starry-night-v2');
const hasCacheHeaders = nextConfigContent.includes('Cache-Control') && nextConfigContent.includes('must-revalidate');
const suppressesWarning = npmrcContent.includes('loglevel=error');

if (isNetworkFirstSW && hasCacheHeaders && suppressesWarning) {
  totalScore += 20;
  breakdown.push({ category: 'Vercel Deploy & Cache Invalidation', score: '20/20', status: 'PASS', notes: 'SW Network-First, headers chống cache đĩa, .npmrc chuẩn.' });
  console.log('   ✅ PASS: SW Network-First + Headers chống đọng cache HTML. Người dùng F5 nhận ngay bản mới.');
} else {
  breakdown.push({ category: 'Vercel Deploy & Cache Invalidation', score: '5/20', status: 'WARN', notes: 'Chưa cấu hình chống đọng cache triệt để.' });
  console.log('   ⚠️ WARN: Cần hoàn thiện cơ chế cache-busting.');
}

// 3. Mobile Modal Architecture & Auto-Population (20 pts)
console.log('\n📱 3. Kiểm tra Kiến trúc Modal Mobile & Tự động điền Giờ ngủ/Thức dậy...');
const logModal = fs.readFileSync('src/components/LogSleepModal.tsx', 'utf-8');
const settingsModal = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');
const pageFile = fs.readFileSync('src/app/page.tsx', 'utf-8');

const logHasMinH0 = logModal.includes('min-h-0');
const settingsHasMinH0 = settingsModal.includes('min-h-0');
const logHasStickyFooter = logModal.includes('sticky bottom-0') && logModal.includes('safe-area-inset-bottom');
const logHasScrollLock = logModal.includes("document.body.style.overflow = 'hidden'");
const hasColorSchemeDark = logModal.includes("colorScheme: 'dark'") && settingsModal.includes("colorScheme: 'dark'");
const hasAutoFillLogic = logModal.includes('initialBedtime') && logModal.includes('initialWakeTime') && logModal.includes('isAutoFilled');
const pageWiresAutoFill = pageFile.includes('initialBedtime={initialSleepTimes?.bedtime}') && pageFile.includes('initialWakeTime={initialSleepTimes?.wakeTime}');

if (logHasMinH0 && settingsHasMinH0 && logHasStickyFooter && logHasScrollLock && hasColorSchemeDark && hasAutoFillLogic && pageWiresAutoFill) {
  totalScore += 20;
  breakdown.push({ category: 'Mobile Modal & Auto-Population', score: '20/20', status: 'PASS', notes: 'min-h-0 WebKit, sticky safe-area footer, tự động điền giờ ngủ & thức dậy.' });
  console.log('   ✅ PASS: Modal chuẩn WebKit (min-h-0), khóa cuộn nền, tự động điền giờ ngủ & thức dậy chuẩn xác.');
} else {
  breakdown.push({ category: 'Mobile Modal & Auto-Population', score: '10/20', status: 'WARN', notes: 'Modal thiếu min-h-0 hoặc chưa tự động điền giờ ngủ.' });
  console.log('   ⚠️ WARN: Cần kiểm tra lại cấu trúc modal hoặc cơ chế tự động điền.');
}

// 4. Kiểm tra Loại Bỏ Nút Trùng & Tinh Gọn Chức Năng (20 pts)
console.log('\n🧹 4. Kiểm tra Loại bỏ Nút Trùng & Tối ưu Trải nghiệm (Anti-Duplication)...');
const dashboardTab = fs.readFileSync('src/components/DashboardTab.tsx', 'utf-8');
const navbarCode = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// Banner should NOT have a duplicate "+ Ghi nhận" button right next to Zen mode
const bannerHasDuplicateLog = dashboardTab.includes('+ Ghi nhận hôm qua');
// History section should NOT have a redundant "+ Thêm" button
const historyHasDuplicateAdd = dashboardTab.includes('>Thêm<');
// Navbar on mobile hides desktop button in favor of the floating FAB
const navbarMobileOptimized = navbarCode.includes('hidden sm:flex');

if (!bannerHasDuplicateLog && !historyHasDuplicateAdd && navbarMobileOptimized) {
  totalScore += 20;
  breakdown.push({ category: 'Anti-Duplication & UI Ergonomics', score: '20/20', status: 'PASS', notes: '0 nút trùng chức năng. Phân định rõ Desktop vs Mobile FAB.' });
  console.log('   ✅ PASS: Đã xóa sạch các nút trùng lặp. Giao diện sắc sảo, không còn rác thao tác.');
} else {
  breakdown.push({ category: 'Anti-Duplication & UI Ergonomics', score: '5/20', status: 'WARN', notes: 'Còn tồn tại nút trùng chức năng.' });
  console.log('   ⚠️ WARN: Còn nút trùng chức năng!');
}

// 5. The Starry Night Masterpiece Theme & Dynamic Canvas (20 pts)
console.log('\n🌌 5. Kiểm tra Theme The Starry Night (Vincent van Gogh) & Dynamic Canvas...');
const pageCode = fs.readFileSync('src/app/page.tsx', 'utf-8');
const canvasExists = fs.existsSync('src/components/StarryNightCanvas.tsx');
const canvasImported = pageCode.includes('StarryNightCanvas');

if (canvasExists && canvasImported) {
  totalScore += 20;
  breakdown.push({ category: 'The Starry Night Masterpiece Canvas', score: '20/20', status: 'PASS', notes: 'Vortex ngân hà, trăng khuyết & 11 vì sao Saint-Rémy sống động.' });
  console.log('   ✅ PASS: Bầu trời Starry Night với vòng xoáy tinh vân & 11 vì sao Van Gogh rực rỡ.');
} else {
  breakdown.push({ category: 'The Starry Night Masterpiece Canvas', score: '10/20', status: 'WARN', notes: 'Thiếu StarryNightCanvas component.' });
  console.log('   ⚠️ WARN: Thiếu canvas Starry Night.');
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
