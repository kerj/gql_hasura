import { ContextType, Display } from "./components/Display";
import { DataProvider } from "./Context/DataContext";

function App() {
  return (
    <div className="App">
      <DataProvider<ContextType> requestMetas={{
        url: "http://localhost:8080/v1/graphql",
        options: {
          method: "post",
          data: JSON.stringify({
            query: `
              query GetCustomers {
                customers(limit: 19, where: {first_name: {_like: "Le%"}}) {
                  email_address
                  first_name
                  last_name
                }
              }
            `,
            operationName: "GetCustomers"
          })
        }
      }}>
        <Display />
      </DataProvider>
    </div>
  );
}

export default App;
