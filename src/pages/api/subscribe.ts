import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from 'next-auth/react';
import {stripe} from "../../services/stripe";

export default async function handleCheckoutSubscribe(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const session =  await getSession({req})

        const stripeCostumer = await stripe.customers.create({
            email: session.user.email,
            // metadata
        })

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCostumer.id,
            payment_method_types:['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1J9bcyJvCQ7ZyjIGWxvfrOcn', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.SUCCESS_url,
            cancel_url: process.env.CANCEL_URL
        })

        return res.status(200).json({sessionId: checkoutSession.id})
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}
