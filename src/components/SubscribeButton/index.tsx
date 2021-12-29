import { useSession, signIn } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const {data: session} = useSession()
  
  // função que cuida da sessão de pagamento; integrado com backend e frontend;
  const handleSubscribe = async () => {
    // função next-auth, que redireciona para tela de sign in usando provider Github.
    if (!session) {
      signIn('github');
      
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data; // a sessionID na verdade é uma ULR de redirecionamento STRING.

      const stripe = await getStripeJs();// usamos a biblioteca stripe-js para recuperar a função de redirecionamento.

      stripe.redirectToCheckout({ sessionId }) // O cliente é redirecionado para a URL passada para o front.
    } catch (err){
      alert(err.message);
    }

  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  )
}