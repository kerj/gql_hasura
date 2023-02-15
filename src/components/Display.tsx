import axios from 'axios';
import { lazy, Suspense, useContext, useState } from 'react'
import '../App.css';
import { DataContext, DataProvider } from '../Context/DataContext';
import { CallbackButton } from './CallbackButton';
const LazyTable = lazy(() => import('./Table'))

export type ContextType = {
  data: {
    data: {
      customers: { email_address: string, first_name: string, last_name: string }[]
    }
  }
}

export const Display = () => {
  const { setStale } = useContext(DataContext);
  const onAdd = () => {
    const url = "http://localhost:8080/v1/graphql"
    const options = {
      method: "post",
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        query: `
          mutation addCustomer {
            insert_customers(
              objects: {
                customer_id: "this-is-a-customerId",
                email_address: "test@test.com",
                last_name: "James",
                first_name: "LeBron"
              }
            ) {
              affected_rows
            }
          }
        `,
        operationName: "addCustomer"
      })
    }

    axios(url, options).then(() => setStale())
  }

  const onRemove = () => {
    const url = "http://localhost:8080/v1/graphql"
    const options = {
      method: "post",
      headers: {
        'Content-type': 'application/json'
      },
      data: JSON.stringify({
        query: `
          mutation deleteCustomer {
            delete_customers_by_pk(customer_id: "this-is-a-customerId") {
              email_address
              first_name
              last_name
            }
          }
        `,
        operationName: "deleteCustomer",
      })
    }

    axios(url, options).then(() => setStale())
  }

  return (
    <>
      <CallbackButton callback={onAdd} text="Add"></CallbackButton>
      <CallbackButton callback={onRemove} text="remove"></CallbackButton>
      <Suspense fallback={<>Loading...</>} >
        <LazyTable />
      </Suspense>

    </>
  )
}
