import { bakersPercent, doughFormula } from '@lp-labs/bakers-percentage';
if (bakersPercent(500, 325) !== 65 || doughFormula(100, [])[0].mass !== 100)
  throw new Error('Formula');
// @ts-expect-error invalid argument must be rejected by declarations
bakersPercent('500', 325);
