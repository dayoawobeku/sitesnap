import {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (
    req.query.secret !== process.env.NEXT_PUBLIC_PREVIEW_TOKEN ||
    !req.query.slug
  ) {
    return res.status(401).json({message: 'Invalid token'});
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies/?publicationState=preview`,
  );

  const companies = await response.data;

  const company = companies?.data?.find(
    (c: {attributes: {slug: string | string[] | undefined}}) =>
      `/companies/${c.attributes.slug}` === req.query.slug,
  );

  if (!company) {
    return res.status(401).json({message: 'Invalid slug'});
  }

  res.setPreviewData({});

  res.redirect(`${req.query.slug}`);
}
