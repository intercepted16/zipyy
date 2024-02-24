interface String {
  prepend(prefix: string): string;
  /**
   * Remove a string from the start of the string if it is at the start of the string.
   */
  removePrefix(prefix: string): string;
  /**
   * Capitalize a string, meaning to make the first character uppercase.
   */
  capitalize(): string;
}

String.prototype.prepend = function (prefix: string): string {
  const str = this as string;
  return str.startsWith(prefix) ? str : prefix + str;
};

String.prototype.removePrefix = function (prefix: string): string {
  const str = this as string;
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
};
String.prototype.capitalize = function (): string {
  const str = this as string;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
