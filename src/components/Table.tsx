import React, { useContext } from 'react'
import { DataContext } from '../Context/DataContext';
import { ContextType } from './Display';

const Headers = ["email_address", "first_name", "last_name"] as const;
type HeadersTuple = typeof Headers;
type Header = HeadersTuple[number]

export const Table = () => {
  const { data }: ContextType = useContext(DataContext)
  const headers: Header[] = data?.data?.customers[0] ? Object.keys(data.data.customers[0]) as Header[] : [];
  return (
    <div className='tableContainer' style={{ color: 'black' }}>
      {
        <table className='table'>
          <thead>
            <tr className='tr'>
              {headers.map(header => (<th>{header}</th>))}
            </tr>
          </thead>
          <tbody>
            {data &&
              (data?.data?.customers || []).map((row, index: number) => (
                <tr key={index}>
                  {headers.map((header, ind) => (
                    <td key={ind} className="td">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      }
    </div>
  )
}

export default Table;