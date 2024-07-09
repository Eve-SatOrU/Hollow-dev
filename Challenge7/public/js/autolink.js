
(() => {
  const autoLink = function(...options) {
    const pattern = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;

    if (options.length === 0) {
      return this.replace(pattern, "$1<a href='$2'>$2</a>");
    }

    const { callback, ...linkAttributes } = options[0];
    const attributes = Object.entries(linkAttributes).map(([key, value]) => ` ${key}='${value}'`).join('');

    return this.replace(pattern, (match, space, url) => {
      const link = (typeof callback === 'function' ? callback(url) : `<a href='${url}'${attributes}>${url}</a>`);
      return `${space}${link}`;
    });
  };

  String.prototype.autoLink = autoLink;
})();