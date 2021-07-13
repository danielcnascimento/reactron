import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //verificar que tipo de método foi requisitado:
  if (req.method === "POST") {
    // "customer: Quem está comprando o produto:"
     const session = await getSession({ req }) // getSession : função que retorna os dados da sessão ativa, retorna dados do usuário. (nome, email e foto.)

     const stripeCustumer = await stripe.customers.create({
       email: session.user.email, // cria um usuário que contém email.
       // metadata,
     })

    //criar sessão stripe:
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustumer.id, // Pega o usuário criado, e retorna o ID.
      payment_method_types: ['card'], // Aceita apenas cartão, para pagamentos mensais.
      billing_address_collection: 'required', // Deverá passar endereço de cobrança.
      line_items: [ // Passa o produto a ser comprado.
        { price: 'price_1J9bcyJvCQ7ZyjIGWxvfrOcn', quantity: 1}, // id do preço do produto + quantidade comprada.
      ],
      mode: 'subscription', // informa que é um produto com cobranças mensais - recorrentes.
      allow_promotion_codes: true, // permite códigos promocionais.
      success_url: process.env.SUCCESS_URL, // rota de sucesso.
      cancel_url: process.env.CANCEL_URL, // rota de erro, ou cancelamento.
    })

    return res.status(200).json({ sessionId: checkoutSession.id })// retorna sucesso é o ID da sessão criada.

  } else {
    //deverá retornar erro, informando que a requisição será apenas "POST".
    res.setHeader("Allow", "POST");// define que esta rota é por padrão "POST".
    res.status(405).end("Method not Allowed") // status e mensagem final.
  }
}