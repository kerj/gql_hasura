import { useEffect } from 'react';
import '../App.css';
import { useCreateCustomerMutation, useDeleteCustomerByPkMutation, useGetCustomersLikeNameLazyQuery } from '../generated/graphql';
import { CallbackButton } from './CallbackButton';
import { Table } from './Table';

export type ContextType = {
  data: {
    data: {
      customers: { email_address: string, first_name: string, last_name: string }[]
    }
  }
}

export const Display = () => {
  const [getCustomers, { data, loading }] = useGetCustomersLikeNameLazyQuery({
    fetchPolicy: 'network-only',
    variables: { limit: 19, first_name_term: "Le%" },
  });
  const [deleteCustomerByPkMutation] = useDeleteCustomerByPkMutation({
    fetchPolicy: 'network-only',
    onCompleted: () => getCustomers()
  })
  const [createCustomerMutation] = useCreateCustomerMutation({
    fetchPolicy: "network-only",
    onCompleted: () => getCustomers()
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

  useEffect(() => {
    // init
    if (!data && !loading) {
      getCustomers()
    }
  }, [data, getCustomers, loading])

  return (
    <>
      <CallbackButton callback={onAdd} text="Add"></CallbackButton>
      <CallbackButton callback={onRemove} text="remove"></CallbackButton>
      <Table data={data} />
    </>
  )
}

export default Display;