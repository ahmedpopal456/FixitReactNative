/**
 * Truncates string and adds ellipse as suffix (...)
 * @param length The length at which the string should be trimmed
 * @returns The truncated string.
 */
 declare global {
  interface String {
      trimEllip(length: number): string}}

// eslint-disable-next-line no-extend-native
String.prototype.trimEllip = function (length: number): string {
  const string = this as string;
  return string.length > length ? `${string.substring(0, length)}...` : string;
};
export {};
