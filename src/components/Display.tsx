import { lazy, Suspense } from 'react'
import '../App.css';
import { useCreateCustomerMutation, useDeleteCustomerByPkMutation } from '../generated/graphql';
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
  const [deleteCustomerByPkMutation] = useDeleteCustomerByPkMutation({
    fetchPolicy: 'network-only',
    
  })
  const [createCustomerMutation] = useCreateCustomerMutation({
    fetchPolicy: "network-only",
  })
  const onAdd = () => {
    createCustomerMutation({
      variables: {
        customer_id: "this-is-a-customerId",
        email_address: "test@test.com",
        last_name: "James",
        first_name: "LeBron"
      }
    })
  }

  const onRemove = () => {
    deleteCustomerByPkMutation({ variables: { customer_id: "this-is-a-customerId" } })
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
