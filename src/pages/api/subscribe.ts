import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
import { query as q } from "faunadb";

type User = {
  ref: {
    id: string,
  },
  data: {
    stripe_customer_id: string,
  }
}

//TODO: função que retorna a interface do Stripe, para pagamento mensal.
export default async (req: NextApiRequest, res: NextApiResponse) => { 
  //TODO: verificar que tipo de método foi requisitado.
  if (req.method === "POST") {
    // "customer: Quem está comprando o produto:"
     const session = await getSession({ req }) // getSession : função que retorna os dados da sessão ativa, retorna dados do usuário. (nome, email e foto.)
     // TODO: selecionar usuário atual da sessão.
     const user = await fauna.query<User>(
       q.Get(
         q.Match(
           q.Index('user_by_email'),
           q.Casefold(session.user.email)  
         )
       )
     )

     let customerId = user.data.stripe_customer_id

     // TODO: se não hover registro STRIPE criado no FaunaDB, criar o registro no STRIPE e adicionar ao FaunaDB, se Já houver, retorna com o ID e pula este escopo.
     if (!customerId) {
      // TODO: cria um usuário que contém email no cadastro - OBS: automaticamente cria um ID no STRIPE.
      const stripeCustumer = await stripe.customers.create({
        email: session.user.email, 
        // metadata,
      })

      // TODO: criar uma query que atualiza o campo de "users" no Fauna, com uma NOVA PROPRIEDADE: "stripe_customer_id"
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustumer.id,
            }
          }
        )
      )

      customerId = stripeCustumer.id;
    }

    //TODO: criar sessão stripe:
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // Pega o usuário criado NO Stripe e adicionado no Fauna, e retorna o ID. //OBS: ele usa o ID criado apenas, mas não o atualiza com ultimo acesso.
      payment_method_types: ['card'], // Aceita apenas cartão, para pagamentos mensais.
      billing_address_collection: 'required', // Deverá passar endereço de cobrança.
      line_items: [ // Passa o produto a ser comprado.
        { price: 'price_1J9bcyJvCQ7ZyjIGWxvfrOcn', quantity: 1}, // id do preço do produto (pego no dashboard Stripe) + quantidade comprada.
      ],
      mode: 'subscription', // informa que é um produto com cobranças mensais - recorrentes.
      allow_promotion_codes: true, // permite códigos promocionais.
      success_url: process.env.SUCCESS_URL, // rota de sucesso.
      cancel_url: process.env.CANCEL_URL, // rota de erro, ou cancelamento.
    })

    return res.status(200).json({ sessionId: checkoutSession.id })// retorna sucesso; também retorna uma URL que será usada para redirecionar o cliente.

  } else {
    //deverá retornar erro, informando que a requisição será apenas "POST".
    res.setHeader("Allow", "POST");// define que esta rota é por padrão "POST".
    res.status(405).end("Method not Allowed") // status e mensagem final.
  }
}