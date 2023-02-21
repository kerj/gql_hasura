import { useApolloClient } from '@apollo/client';
import '../App.css';
import { GetCustomersLikeNameDocument, useCreateCustomerMutation, useDeleteCustomerByPkMutation, useGetCustomersLikeNameQuery } from '../generated/graphql';
import { CallbackButton } from './CallbackButton';
import { Search } from './Search';
import { Table } from './Table';

export type ContextType = {
  data: {
    data: {
      customers: { email_address: string, first_name: string, last_name: string }[]
    }
  }
}

export const Display = () => {
  const client = useApolloClient()

  useGetCustomersLikeNameQuery({
    variables: { limit: 19, first_name_term: "Le%" },
  })
  // reads from cache for this query
  const customers = client.readQuery({
    query: GetCustomersLikeNameDocument,
    variables: { limit: 19, first_name_term: "Le%" }
  })

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
      },
      refetchQueries: [{ query: GetCustomersLikeNameDocument, variables: { limit: 19, first_name_term: "Le%" } }]
    })
  }
  const onRemove = () => {
    deleteCustomerByPkMutation({
      variables: {
        customer_id: "this-is-a-customerId"
      },
      refetchQueries: [{
        query: GetCustomersLikeNameDocument,
        variables: { limit: 19, first_name_term: "Le%" }
      }]
    })
  }

  return (
    <>
      {
        true &&
        <>
          <CallbackButton callback={onAdd} text="Add"></CallbackButton>
          <CallbackButton callback={onRemove} text="remove"></CallbackButton>
          {customers &&
            <Table data={customers} />
          }
        </>
      }
      {true &&
        <Search />
      }
    </>
  )
}

export default Display;