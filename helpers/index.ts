function slugify(string: string) {
  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export {slugify};
