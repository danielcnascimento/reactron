import { session, signIn } from "next-auth/client";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const handleSubscribe = () => {
    if (!session) {
      signIn('github')// função next-auth, que redireciona para tela de sign in usando providefer Github.
      
      return;
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