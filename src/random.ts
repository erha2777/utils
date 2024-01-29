/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns 随机范围内整数
 */
export const randomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min