# @lp-labs/bakers-percentage

Flour-relative baking percentages and target dough scaling.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/bakers-percentage
```

## Working example

```js
import { bakersPercent, doughFormula } from '@lp-labs/bakers-percentage';
if (bakersPercent(500, 325) !== 65 || doughFormula(100, [])[0].mass !== 100)
  throw new Error('Formula');
```

CommonJS: `const api = require('@lp-labs/bakers-percentage')`.

## Behavior, customization and limits

bakersPercent(flourMass,ingredientMass) returns100*ingredient/flour. doughFormula(totalMass,ingredients) uses implicit flour100%, plus unique {name,percent} non-flour ingredients; returns flour row and scaled rows {name,percent,mass}. Names nonempty<=100chars, "flour" reserved, <=1000 entries, percentages0..10000, target positive<=1e12. Same mass unit throughout; O(ingredients), does not account for ingredient moisture or baking loss.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface BakerIngredient {
  name: string;
  percent: number;
}
export interface DoughIngredient extends BakerIngredient {
  mass: number;
}
export declare function bakersPercent(flourMass: number, ingredientMass: number): number;
export declare function doughFormula(
  totalMass: number,
  ingredients: readonly BakerIngredient[],
): DoughIngredient[];
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
