import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('water percentage', () => {
  assert.equal(api.bakersPercent(500, 325), 65);
});
test('target dough reference', () => {
  const p = api.doughFormula(1000, [
    { name: 'water', percent: 60 },
    { name: 'salt', percent: 2 },
  ]);
  assert.ok(Math.abs(p[0].mass - 1000 / 1.62) < 1e-10);
  assert.ok(Math.abs(p.reduce((s, x) => s + x.mass, 0) - 1000) < 1e-10);
});
test('flour only and zero ingredient', () => {
  assert.deepEqual(api.doughFormula(100, []), [{ name: 'flour', percent: 100, mass: 100 }]);
  assert.equal(api.doughFormula(100, [{ name: 'salt', percent: 0 }])[1].mass, 0);
});
test('unique names and ownership', () => {
  assert.throws(() => api.doughFormula(100, [{ name: 'flour', percent: 2 }]));
  assert.throws(() =>
    api.doughFormula(100, [
      { name: 'x', percent: 2 },
      { name: 'x', percent: 3 },
    ]),
  );
  const a = { name: 'x', percent: 20 };
  api.doughFormula(100, [a]);
  assert.deepEqual(a, { name: 'x', percent: 20 });
});
test('invalid quantities', () => {
  assert.throws(() => api.bakersPercent(0, 1));
  assert.throws(() => api.doughFormula(-1, []));
  assert.throws(() => api.doughFormula(1, [{ name: 'x', percent: NaN }]));
});
test('percentage conservation oracle', () => {
  for (let p = 0; p <= 100; p += 5) {
    const rows = api.doughFormula(750, [{ name: 'water', percent: p }]);
    assert.ok(Math.abs((rows[1].mass / rows[0].mass) * 100 - p) < 1e-12);
  }
});
test('subnormal flour preserves or rejects resolution', () => {
  assert.equal(api.doughFormula(Number.MIN_VALUE, [])[0].mass, Number.MIN_VALUE);
  assert.throws(() => api.doughFormula(Number.MIN_VALUE, [{ name: 'x', percent: 1000 }]));
});
