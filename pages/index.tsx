import React, { Suspense } from 'react'
import Layout from '../components/Layout'
import { Display } from '../components/Display'
import { HttpLink, split, InMemoryCache, ApolloClient, ApolloProvider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const http = new HttpLink({
  uri: "http://localhost:8080/v1/graphql"
})
const wsGql = typeof window !== "undefined" ? new GraphQLWsLink(createClient({
  url: "ws://localhost:8080/v1/graphql"
  // connectionParams: {
  //   authToken: auth
  // }
})) : null;
// allows subscriptions to use ws and others to use http
const splitLink = typeof window !== "undefined" && wsGql !== null ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsGql,
  http
) : http

const cache = new InMemoryCache({
  typePolicies: {
    Subscription: {
      fields: {
        customers_stream: {
          read(value) {
            console.log(value)
            return value?.email_address?.toUpperCase()
          },
          merge(ex, incoming) {
            const existing = ex || []
            console.log(ex, incoming)
            return [...existing, ...incoming]
          }
        }
      }
    }
  }
})

const client = new ApolloClient({
  cache,
  link: splitLink,
})

const index = () => {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<>Loading...</>} >
        <Layout home>
          <Display></Display>
        </Layout>
      </Suspense>
    </ApolloProvider>
  )
}

export default index