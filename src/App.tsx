
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { Display } from "./components/Display";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:8080/v1/graphql"
  })
})

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
          <Display />
      </ApolloProvider>
    </div>
  );
}

export default App;
