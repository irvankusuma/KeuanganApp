import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_DIR = 'src';
const FILE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html']);
const FORBIDDEN_PATTERNS = [
  { regex: /^diff --git /m, reason: 'header patch/diff tidak boleh ada di source code' },
  { regex: /^index [0-9a-f]{7,}\.{2}[0-9a-f]{7,}/m, reason: 'metadata patch git tidak boleh ada di source code' },
  { regex: /^--- a\//m, reason: 'marker patch lama terdeteksi' },
  { regex: /^\+\+\+ b\//m, reason: 'marker patch baru terdeteksi' },
  { regex: /^<{7}|^={7}|^>{7}/m, reason: 'marker konflik git terdeteksi' }
];

const issues = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const extension = `.${entry.split('.').pop()}`;
    if (!FILE_EXTENSIONS.has(extension)) continue;

    const content = readFileSync(fullPath, 'utf8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.regex.test(content)) {
        issues.push({ file: fullPath, reason: pattern.reason });
        break;
      }
    }
  }
};

walk(SOURCE_DIR);

if (issues.length > 0) {
  console.error('\n❌ Validasi source gagal: ditemukan teks patch/konflik yang tidak seharusnya.\n');
  for (const issue of issues) {
    console.error(`- ${issue.file}: ${issue.reason}`);
  }
  process.exit(1);
}

console.log('✅ Validasi source: tidak ada marker patch/konflik.');
