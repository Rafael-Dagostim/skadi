import { resolveKConstant } from "./resolve_k_constant";

export const getTemperatureOnInstant = (
  ambientTemperature: number,
  initialTemperature: number,
  firstInstantTemperature: number,
  firstInstantValue: number,
  nextInstant: number
) => {
  let k = resolveKConstant(
    ambientTemperature, initialTemperature, firstInstantTemperature, firstInstantValue
  );
  console.log(k);
  
  return ambientTemperature + (initialTemperature - ambientTemperature) * (Math.E ** (k * nextInstant));
};