import { query as q } from 'faunadb';

import NextAuth from 'next-auth'
import { fauna } from '../../../services/fauna'

import { signIn } from 'next-auth/client'
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
          q.Create(
            q.Collection('users'),
            { data: { email } }
          )
        )
        
        return true
      } catch {
        return false
      }
    }
  }
})