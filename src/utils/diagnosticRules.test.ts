import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePhoneHealthScore, evaluateProblemDetails, formatBytes } from './diagnosticRules.ts';

test('Phone health score calculation for ideal device', () => {
  const result = calculatePhoneHealthScore({
    batteryHealthPct: 96,
    storageUsedPct: 62,
    ramUsedPct: 48,
    batteryTempC: 31,
    failedHardwareTestsCount: 0,
    totalHardwareTestsTested: 10,
  });

  assert.equal(result.score, 100);
  assert.equal(result.condition, 'Good Condition');
  assert.equal(result.label, 'Good');
});

test('Phone health score degrades with overheating and hardware failures', () => {
  const result = calculatePhoneHealthScore({
    batteryHealthPct: 70,
    storageUsedPct: 92,
    ramUsedPct: 88,
    batteryTempC: 44, // overheating > 42
    failedHardwareTestsCount: 2,
    totalHardwareTestsTested: 10,
  });

  // Should deduct points for failed hardware, degraded battery, overheating, storage, and ram
  assert.ok(result.score < 60);
  assert.equal(result.condition, 'Needs Attention');
});

test('Problem evaluator correctly flags physical screen damage as requiring a technician', () => {
  const evaluation = evaluateProblemDetails('Yeh dekho meri screen ka ye masla hai, crack hai kya theek ho sakta hai?');

  assert.equal(evaluation.isHardware, true);
  assert.equal(evaluation.requiresTechnician, true);
  assert.equal(evaluation.severity, 'high');
  assert.ok(evaluation.technicianReason?.includes('thermal separation'));
  assert.ok(evaluation.possibleCauses.length > 0);
  assert.ok(evaluation.stepByStepInstructions.length > 0);
});

test('Problem evaluator provides software troubleshooting for hanging/lag without technician', () => {
  const evaluation = evaluateProblemDetails('Mera phone bar bar hang ho raha hai, is ka kya reason ho sakta hai?');

  assert.equal(evaluation.isHardware, false);
  assert.equal(evaluation.requiresTechnician, false);
  assert.equal(evaluation.severity, 'medium');
  assert.ok(evaluation.possibleCauses.some(c => c.toLowerCase().includes('ram') || c.toLowerCase().includes('background')));
});

test('formatBytes formats GB and MB correctly', () => {
  assert.equal(formatBytes(1073741824 * 64), '64.0 GB');
  assert.equal(formatBytes(1048576 * 512), '512 MB');
  assert.equal(formatBytes(0), '0 GB');
});
