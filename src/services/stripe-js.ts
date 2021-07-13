import { loadStripe } from '@stripe/stripe-js'

//Função que retorna um objeto, contendo funções de redirecionamento.
export async function getStripeJs() {
  //usa o loadStripe para permitir o uso de chamados usando API.
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

  return stripeJs;
}