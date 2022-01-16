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
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs() // Esse cara tem a responsa de buscar a class que possui o método de redirecionamento.

      await stripe.redirectToCheckout({sessionId})
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
