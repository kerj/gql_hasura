
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { lazy, Suspense } from "react";
import { getMainDefinition } from "@apollo/client/utilities";
const Display = lazy(() => import("./components/Display"))

const http = new HttpLink({
  uri: "http://localhost:8080/v1/graphql"
})
const ws = new GraphQLWsLink(createClient({
  url: "ws://localhost:8080/v1/graphql"
  // connectionParams: {
  //   authToken: auth
  // }
}));
// allows subscriptions to use ws and others to use http
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  ws,
  http
)

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

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Suspense fallback={<>Loading...</>} >
          <Display />
        </Suspense>
      </ApolloProvider>
    </div>
  );
}

export default App;
