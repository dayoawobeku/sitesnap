import {NextApiRequest, NextApiResponse} from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the cookies set by the preview mode.
  res.clearPreviewData();

  // Send a 200-Success response to the frontend
  res.status(200).end();
}
