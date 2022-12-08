export const resolveKConstant = (
  ambientTemperature: number,
  initialTemperature: number,
  firstInstantTemperature: number,
  firstInstantValue: number,
) => {
  const k = Number((Math.log(
    (firstInstantTemperature - ambientTemperature) / (initialTemperature - ambientTemperature)
  ) / firstInstantValue).toFixed(3))
  console.log(k);
  return k;
};
