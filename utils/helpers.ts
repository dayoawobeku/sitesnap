function slugify(string: string) {
  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

function capitalizeFirstLetter(word: string) {
  return word?.charAt(0).toUpperCase() + word?.slice(1);
}

export {slugify, capitalizeFirstLetter};
