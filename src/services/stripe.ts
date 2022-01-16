import Stripe from 'stripe';

console.log(process.env.STRIPE_API_KEY)
 export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
   {
     apiVersion: '2020-08-27',
     appInfo: {
      "name": "reactron",
      "version": "0.1.0",
     }
   }
 )
