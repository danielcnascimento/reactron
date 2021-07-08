import { NextApiRequest, NextApiResponse } from 'next';

export default (req:NextApiRequest, res: NextApiResponse) => {
  const users = [
    {id: 1, nome: "daniel"},
    {id: 2, nome: "Hessa"},
    {id: 3, nome: "Danilo"},
  ]

  return res.json(users);
}