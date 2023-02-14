import axios from 'axios';
import { lazy, Suspense } from 'react'
import '../App.css';
import { DataProvider } from '../Context/DataContext';
const LazyTable = lazy(() => import('./Table'))

export type ContextType = {
  data: {
    data: {
      customers: { email_address: string, first_name: string, last_name: string }[]
    }
  }
}

export const Display = ({ url }: { url: string }) => {
  const onAdd = () => {
    const url = 'http://localhost:3000/addcustomer'
    const options = {
      method: "post",
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        customerId: "this-is-a-customerId",
        email: "test@test.com",
        first_name: "Lebron",
        last_name: "James",
      })
    }

    axios(url, options)
  }

  const onRemove = () => {
    const url = 'http://localhost:3000/removecustomer'
    const options = {
      method: "post",
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        customerId: "this-is-a-customerId",
      })
    }

    axios(url, options)
  }

  return (
    <>
      <DataProvider<ContextType> requestMetas={{
        url: "http://localhost:8080/v1/graphql", options: {
          method: "post",
          data: JSON.stringify({
            query: `
              query GetCustomers {
                customers(limit: 10) {
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
        <Suspense fallback={<>Loading...</>} >
          <LazyTable />
        </Suspense>
      </DataProvider>
      <DataProvider<ContextType> requestMetas={{
        url: "http://localhost:8080/v1/graphql", options: {
          method: "post",
          data: JSON.stringify({
            query: `
              query GetCustomers {
                customers(limit: 19) {
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
        <Suspense fallback={<>Loading...</>} >
          <LazyTable />
        </Suspense>
      </DataProvider>
    </>
  )
}
