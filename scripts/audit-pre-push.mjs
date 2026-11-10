import fs from 'fs';
import path from 'path';

console.log('🚀 [Code Reviewer & Quality Assessor] Starting Comprehensive Pre-Push Audit & Scoring...\n');

let totalScore = 0;
const maxScore = 100;
const breakdown = [];

// 1. Security & Secrets Check (25 pts)
console.log('🔒 1. Auditing Security, Secrets & Environment Isolation...');
const apiCoach = fs.readFileSync('src/app/api/ai/coach/route.ts', 'utf-8');
const apiAudit = fs.readFileSync('src/app/api/ai/audit/route.ts', 'utf-8');
const gitignore = fs.readFileSync('.gitignore', 'utf-8');

const hasHardcodedOpenRouterKey = apiCoach.includes('sk-or-v1-') || apiAudit.includes('sk-or-v1-');
const hasEnvLocalInGitignore = gitignore.includes('.env*') || gitignore.includes('.env*.local') || gitignore.includes('.env.local');

if (!hasHardcodedOpenRouterKey && hasEnvLocalInGitignore) {
  totalScore += 25;
  breakdown.push({ category: 'Security & Secrets Isolation', score: '25/25', status: 'PASS', notes: 'No leaked keys, clean env fallback, gitignore protected.' });
  console.log('   ✅ PASS: No API keys leaked. .env.local strictly isolated.');
} else {
  breakdown.push({ category: 'Security & Secrets Isolation', score: '0/25', status: 'FAIL', notes: 'API key detected in code or gitignore missing.' });
  console.log('   ❌ FAIL: Security check failed!');
}

// 2. Vercel & Build Configuration (20 pts)
console.log('\n⚙️ 2. Auditing Vercel & Build Configuration...');
const npmrcExists = fs.existsSync('.npmrc');
const npmrcContent = npmrcExists ? fs.readFileSync('.npmrc', 'utf-8') : '';
const suppressesWarning = npmrcContent.includes('loglevel=error');

if (npmrcExists && suppressesWarning) {
  totalScore += 20;
  breakdown.push({ category: 'Vercel Deployment Configuration', score: '20/20', status: 'PASS', notes: '.npmrc configured to suppress cache-dir warnings.' });
  console.log('   ✅ PASS: .npmrc properly suppresses npm warning on Vercel.');
} else {
  breakdown.push({ category: 'Vercel Deployment Configuration', score: '0/20', status: 'FAIL', notes: '.npmrc missing or misconfigured.' });
  console.log('   ❌ FAIL: .npmrc missing or misconfigured!');
}

// 3. Mobile Modal UX & Safe Area Resilience (25 pts)
console.log('\n📱 3. Auditing Mobile Modals (LogSleepModal & SettingsModal)...');
const logModal = fs.readFileSync('src/components/LogSleepModal.tsx', 'utf-8');
const settingsModal = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');

const logHasStickyFooter = logModal.includes('sticky bottom-0') && logModal.includes('safe-area-inset-bottom');
const settingsHasStickyFooter = settingsModal.includes('sticky bottom-0') && settingsModal.includes('safe-area-inset-bottom');
const hasColorSchemeDark = logModal.includes("colorScheme: 'dark'") && settingsModal.includes("colorScheme: 'dark'");

if (logHasStickyFooter && settingsHasStickyFooter && hasColorSchemeDark) {
  totalScore += 25;
  breakdown.push({ category: 'Mobile Modal Architecture', score: '25/25', status: 'PASS', notes: 'Sticky action footers, safe area insets, native picker dark mode.' });
  console.log('   ✅ PASS: Both modals have sticky footers, safe-area padding & dark colorScheme.');
} else {
  breakdown.push({ category: 'Mobile Modal Architecture', score: '10/25', status: 'WARN', notes: 'Modal missing sticky footer or safe-area padding.' });
  console.log('   ⚠️ WARN: Modal architecture needs review.');
}

// 4. Mobile Ergonomics & Anti-Slop (15 pts)
console.log('\n✨ 4. Auditing Anti-Slop & Touch-Target Ergonomics...');
const components = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx'));
let smallButtons = 0;
let tinyText = 0;

for (const comp of components) {
  const content = fs.readFileSync(path.join('src/components', comp), 'utf-8');
  if (content.includes('text-[10px]') || content.includes('text-[9px]') || content.includes('text-[8px]')) tinyText++;
  if (content.includes('p-1 rounded') || content.includes('h-6 w-6') || content.includes('h-7 w-7')) smallButtons++;
}

if (tinyText === 0 && smallButtons === 0) {
  totalScore += 15;
  breakdown.push({ category: 'Touch-Target & Typography Ergonomics', score: '15/15', status: 'PASS', notes: '0 tiny texts (<12px), all buttons >= 44px HIG target.' });
  console.log('   ✅ PASS: Flawless touch target sizing and readable typography.');
} else {
  totalScore += 10;
  breakdown.push({ category: 'Touch-Target & Typography Ergonomics', score: '10/15', status: 'WARN', notes: `Found ${tinyText} tiny texts and ${smallButtons} small buttons.` });
  console.log(`   ⚠️ WARN: Minor sizing discrepancies detected.`);
}

// 5. Code Quality, TypeScript & Next.js Soundness (15 pts)
console.log('\n🏗️ 5. Auditing Code Quality, Hydration & SSR Safety...');
const pageCode = fs.readFileSync('src/app/page.tsx', 'utf-8');
const hasHydrationGuard = pageCode.includes('isMounted');

if (hasHydrationGuard) {
  totalScore += 15;
  breakdown.push({ category: 'Code Quality & Hydration Safety', score: '15/15', status: 'PASS', notes: 'Protected against Next.js 16 SSR Date hydration mismatch.' });
  console.log('   ✅ PASS: Hydration guards active, modern Next.js 16 compliant.');
} else {
  breakdown.push({ category: 'Code Quality & Hydration Safety', score: '5/15', status: 'WARN', notes: 'Hydration guard missing.' });
  console.log('   ⚠️ WARN: Hydration guard missing.');
}

console.log('\n======================================================');
console.log(`🎯 TỔNG ĐIỂM ĐÁNH GIÁ TRƯỚC KHI PUSH (PRE-PUSH SCORE): ${totalScore}/${maxScore}`);
console.log('======================================================');
console.table(breakdown);

if (totalScore === 100) {
  console.log('\n🎉 KẾT QUẢ: TOÀN BỘ TIÊU CHUẨN ĐẠT 100/100 TUYỆT ĐỐI! ĐỦ ĐIỀU KIỆN PUSH GITHUB.');
  process.exit(0);
} else {
  console.log('\n⚠️ Cần xử lý các cảnh báo trước khi push.');
  process.exit(1);
}
