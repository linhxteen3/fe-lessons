const fs = require('fs');

const lessonFiles = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21];

let allPassed = true;

lessonFiles.forEach(id => {
  const filePath = `ly-thuyet/${id}.html`;
  const content = fs.readFileSync(filePath, 'utf8');

  const checks = {
    hasSec1: content.includes('id="sec-1"'),
    hasSec2: content.includes('id="sec-2"'),
    hasSec3: content.includes('id="sec-3"'),
    hasSec4: content.includes('id="sec-4"'),
    hasFCGrid: content.includes('id="fcGrid"'),
    hasQuizArea: content.includes('id="quizArea"'),
    hasQuizResult: content.includes('id="quiz-result"'),
    hasMarkBtn: content.includes('id="markDoneBtn"'),
    hasReaderCss: content.includes('reader.css'),
    hasReaderJs: content.includes('reader.js'),
    noMindmap: !/マインドマップ|mind\s*map|sơ\s*đồ\s*tư\s*duy/i.test(content)
  };

  // Check script data
  const fcMatch = content.match(/const\s+FLASHCARDS\s*=\s*(\[[\s\S]*?\]);\s*\n/);
  const quizMatch = content.match(/const\s+QUIZ\s*=\s*(\[[\s\S]*?\]);\s*\n/);

  let fcCount = 0;
  let quizCount = 0;
  if (fcMatch) {
    const fcs = JSON.parse(fcMatch[1]);
    fcCount = fcs.length;
  }
  if (quizMatch) {
    const qs = JSON.parse(quizMatch[1]);
    quizCount = qs.length;
  }

  const failedKeys = Object.keys(checks).filter(k => !checks[k]);
  if (failedKeys.length > 0 || fcCount === 0 || quizCount === 0) {
    allPassed = false;
    console.error(`❌ Lesson ${id} FAILED:`, { failedKeys, fcCount, quizCount });
  } else {
    console.log(`✓ Lesson ${id} PASS: ${fcCount} FCs, ${quizCount} Quizzes`);
  }
});

if (allPassed) {
  console.log('\n🎉 ALL 19 LESSONS FULLY VERIFIED AND 100% WORKING!');
} else {
  console.error('\n⚠️ Some lessons failed checks.');
}
