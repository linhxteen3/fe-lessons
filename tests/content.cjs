const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test } = require('node:test');

const catalog = JSON.parse(fs.readFileSync('lessons.json', 'utf8')).lessons;
const roadmap = JSON.parse(fs.readFileSync('roadmap.json', 'utf8'));

function data(file, id) {
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)</script>`));
  assert.ok(match, `${file}: missing ${id}`);
  return JSON.parse(match[1]);
}

test('Roadmap covers the catalog once and all published files exist', () => {
  const ids = roadmap.stages.flatMap(stage => stage.lessons);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort((a, b) => a - b), catalog.map(l => l.stt).sort((a, b) => a - b));
  for (const lesson of catalog) {
    for (const kind of ['theory', 'test']) {
      if (lesson[kind]) assert.ok(fs.existsSync(lesson[kind]), lesson[kind]);
    }
  }
});

test('Published question banks have valid answers and every theory identifies its lesson', () => {
  for (const lesson of catalog) {
    for (const kind of ['theory', 'test']) {
      const file = lesson[kind];
      if (!file) continue;
      const bank = data(file, kind === 'theory' ? 'lesson-data' : 'quiz-data');
      if (kind === 'theory') {
        assert.equal(bank.number, lesson.stt, file);
        assert.ok(Array.isArray(bank.cards), file);
      }
      const questions = kind === 'theory' ? bank.quiz : bank;
      assert.ok(Array.isArray(questions) && questions.length, file);
      for (const [index, question] of questions.entries()) {
        assert.ok(Array.isArray(question.opts) && question.opts.length >= 2, `${file}:${index}`);
        assert.ok(Number.isInteger(question.ans) && question.ans >= 0 && question.ans < question.opts.length, `${file}:${index}`);
      }
    }
  }
});

test('Every quiz uses shared scripts and styles instead of embedded copies', () => {
  for (const lesson of catalog.filter(l => l.test)) {
    const html = fs.readFileSync(lesson.test, 'utf8');
    for (const name of ['site.js', 'brilliant.js', 'quiz.js', 'site.css', 'learning.css', 'quiz.css']) {
      assert.equal(html.split(`../assets/${name}`).length - 1, 1, `${lesson.test}: ${name}`);
    }
    assert.ok(!html.includes('window.FE =') && !html.includes('One question flow for every test'), lesson.test);
    for (const match of html.matchAll(/(?:src|href)=["'](\.\.\/assets\/[^"']+)["']/g)) {
      assert.ok(fs.existsSync(require('node:path').join('kiem-tra', match[1])), `${lesson.test}: ${match[1]}`);
    }
  }
});
