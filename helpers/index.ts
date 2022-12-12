function slugify(string: string) {
  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

function capitalizeFirstLetter(word: string) {
  return word?.charAt(0).toUpperCase() + word?.slice(1);
}

const url =
  process.env.NEXT_PUBLIC_APP_ENVIRONMENT === 'development'
    ? 'https://sitesnap-git-dev-sitesnap.vercel.app'
    : process.env.NEXT_PUBLIC_APP_ENVIRONMENT === 'production'
    ? 'https://sitesnap.design'
    : '';

const ogImage =
  'https://res.cloudinary.com/dspbvhlt6/image/upload/v1670880238/omoui-uploads/meta_image_ni0pdf.png';

export {slugify, capitalizeFirstLetter, url, ogImage};
