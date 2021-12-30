import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  jwt: { // WARN: chave gerada de forma aleatória, chave sem valor de negócio.
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  callbacks : {// MEANING: fica escutando os métodos de auto do next.js, e realiza ações ao serem chamados.
    async signIn({ user }){ // MEANING: chamada assincrona que faz login caso retorno seja true.
      const { email } = user;

      try {
        await fauna.query(
          q.If(q.Not(q.Exists(q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email),
                )
              )
            ),
            //then
            q.Create(q.Collection('users'),
              { data: { email } },
            ),
            //else
            q.Get(q.Match(
                q.Index('user_by_email'),
                q.Casefold(email),
              )
            )
          )
        )

        return true
      } catch {
        return false
      }
    }
  }
})