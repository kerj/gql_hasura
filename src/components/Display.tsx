import '../App.css';
import { useCreateCustomerMutation, useDeleteCustomerByPkMutation, useSubGetCustomersLikeNameSubscription } from '../generated/graphql';
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
  const { data } = useSubGetCustomersLikeNameSubscription({
    variables: { limit: 19, fn_like: "Le%" },
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
      }
    })
  }
  const onRemove = () => {
    deleteCustomerByPkMutation({ variables: { customer_id: "this-is-a-customerId" } })
  }

  return (
    <>
      {
        false &&
        <>
          <CallbackButton callback={onAdd} text="Add"></CallbackButton>
          <CallbackButton callback={onRemove} text="remove"></CallbackButton>
          {data &&
            <Table data={data} />
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