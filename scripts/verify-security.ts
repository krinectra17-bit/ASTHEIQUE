import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function auditSecurity() {
  console.log('========================================================');
  console.log(' AESTHIQUE SECURITY AUDIT & CREDENTIAL PROTECTION');
  console.log('========================================================\n');

  // 1. Verify .gitignore ignores sensitive files
  console.log('1. Verifying .gitignore configuration...');
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const envIgnored = gitignore.includes('.env*.local') || gitignore.includes('.env');
  console.log(`   .env and .env.local ignored in .gitignore: ${envIgnored ? 'PASS' : 'FAIL'}`);

  // Test git check-ignore
  try {
    const gitIgnoreOutput = execSync('git check-ignore .env .env.local .env.production', { encoding: 'utf8' });
    console.log(`   Git actively ignores: ${gitIgnoreOutput.trim().replace(/\r?\n/g, ', ')} (PASS)`);
  } catch (err: any) {
    console.log('   Git ignore check note:', err.message);
  }

  // 2. Scan tracked git files for leaked secrets or private keys
  console.log('\n2. Scanning git tree for leaked secrets...');
  const trackedFiles = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
  let sensitiveFound = false;
  for (const file of trackedFiles) {
    if (file.includes('.env') && !file.includes('.example')) {
      console.error(`   [CRITICAL] Sensitive file tracked in git: ${file}`);
      sensitiveFound = true;
    }
  }
  if (!sensitiveFound) {
    console.log('   No .env or secret files tracked in Git repo (PASS)');
  }

  // 3. Check for hardcoded secret keys in src/ directory
  console.log('\n3. Scanning src/ directory for hardcoded secrets...');
  const secretKeywords = [
    'rzp_live_',
    'sb_secret_',
    'service_role',
    'password123',
    'PRIVATE KEY-----'
  ];

  let violations = 0;
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scanDir(full);
      } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')) {
        const content = fs.readFileSync(full, 'utf8');
        for (const kw of secretKeywords) {
          if (content.includes(kw)) {
            // Check if it's just mentioning environment variable name
            if (!content.includes(`process.env.${kw}`) && !content.includes(`SUPABASE_SERVICE_ROLE_KEY`)) {
              console.warn(`   Warning: possible pattern "${kw}" in ${full}`);
              violations++;
            }
          }
        }
      }
    }
  }
  scanDir('src');
  if (violations === 0) {
    console.log('   Zero hardcoded secrets found in source code (PASS)');
  }

  // 4. Verify HTTP Security Headers in next.config.ts
  console.log('\n4. Verifying HTTP Security Headers in next.config.ts...');
  const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
  const headers = [
    'X-DNS-Prefetch-Control',
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy'
  ];
  for (const h of headers) {
    const hasHeader = nextConfig.includes(h);
    console.log(`   ${h}: ${hasHeader ? 'CONFIGURED (PASS)' : 'MISSING'}`);
  }
}

auditSecurity();
