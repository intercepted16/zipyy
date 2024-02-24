interface String {
  prepend(prefix: string): string;
  removePrefix(prefix: string): string;
}

String.prototype.prepend = function (prefix: string): string {
  const str = this as string;
  return str.startsWith(prefix) ? str : prefix + str;
};

String.prototype.removePrefix = function (prefix: string): string {
  const str = this as string;
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
};
