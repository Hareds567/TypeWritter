let a = 0;
export default a;

export function calculateWPM(totalKeysPressed: number, timeElapsed: number) {
  const words = totalKeysPressed / 5;
  return words / timeElapsed;
}
