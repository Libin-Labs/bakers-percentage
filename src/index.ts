function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function strictText(value: string, max = 16384): void {
  if (typeof value !== 'string') throw new TypeError('Expected string');
  if (value.length > max) throw new RangeError('Text length budget exceeded');
}
export interface BakerIngredient {
  name: string;
  percent: number;
}
export interface DoughIngredient extends BakerIngredient {
  mass: number;
}
export function bakersPercent(flourMass: number, ingredientMass: number): number {
  return finite(100 * (finite(ingredientMass, 0) / finite(flourMass, Number.MIN_VALUE)), 0);
}
export function doughFormula(
  totalMass: number,
  ingredients: readonly BakerIngredient[],
): DoughIngredient[] {
  finite(totalMass, Number.MIN_VALUE, 1e12);
  if (!Array.isArray(ingredients) || ingredients.length > 1000)
    throw new RangeError('Ingredient budget');
  const names = new Set(['flour']);
  let sum = 100;
  for (const item of ingredients) {
    if (!item) throw new TypeError('Expected ingredient');
    strictText(item.name, 100);
    if (!item.name || names.has(item.name)) throw new RangeError('Unique non-flour names required');
    names.add(item.name);
    sum += finite(item.percent, 0, 10000);
  }
  const flour = finite(totalMass * (100 / sum), Number.MIN_VALUE);
  return [
    { name: 'flour', percent: 100, mass: flour },
    ...ingredients.map((item) => ({
      name: item.name,
      percent: item.percent,
      mass: flour * (item.percent / 100),
    })),
  ];
}
