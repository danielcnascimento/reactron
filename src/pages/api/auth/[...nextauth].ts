import { query as q } from 'faunadb';

import NextAuth from 'next-auth'
import { fauna } from '../../../services/fauna'

import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),

  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  callbacks : {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(q.Not( q.Exists(q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email),
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
                q.Casefold(user.email),
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