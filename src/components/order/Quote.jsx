import React, { useMemo } from 'react';
import DataTable from '../Shared/DataTable'
//import { quoteData } from '../../data'
import Badge from "../ui/Badge"
const Quote = ({data}) => {
    const columns = useMemo(
      () => [
        {
          Header: 'Quote#',
          accessor: 'quote',
          Cell: ({ row }) => (
            <span className="font-medium text-brand-500">{row.original.quote}</span>
          ),
        },
        { Header: 'Quote name', accessor: 'quotename' },
        { Header: 'Status', accessor: 'status', 
          Cell: ({ row }) => (
            row.original.status === "Draft" ? <Badge size="sm" color="light">Draft</Badge> : 
                row.original.status === "Sent for approval" ? <Badge size="sm" color="info">Sent for approval</Badge> : 
                row.original.status === "Internally Approved" ? <Badge size="sm" color="success">Internally Approved</Badge> : 
                row.original.status === "Internally Rejected" ? <Badge size="sm" color="error">Internally Rejected</Badge> : 
                <Badge size="sm" color="warning">Unknown</Badge>
          ),
        },
        { Header: 'Quote date', accessor: 'quote_date' },
        { Header: 'Salesperson', accessor: 'salesperson' },
        { Header: 'Sub Total', accessor: 'subtotal' },
        { Header: 'Total', accessor: 'total' },
        {
          Header: '',
          accessor: 'actions', // This can be a placeholder since we will render custom content
          Cell: ({ row }) => (
    
              <span onClick={() => handleIconClick(row.original.id)} className="font-medium text-gray-500 hover:text-gray-700 cursor-pointer flex items-center justify-center">
                <i className='fa fa-eye'></i>
              </span>
    
          ),
        },
      ],
      []
    );

     // Function to handle icon click
 const handleIconClick = (id) => {
    alert(`Row ID: ${id}`); // You can replace this with any action you want to perform
  };
  const memoizedData = useMemo(() => {
    return data.map(row => ({
      id:row.ID,
      quote: row.Quote,
      quotename: row.Quote_name,
      status: row.Status,
      quote_date:row.Quote_date,
      salesperson:row.Salesperson.display_value,
      subtotal:`$${row.Sub_Total}`,
      total: `$${row.Total}`
    }));
  }, [data]);
  return (
    <>
     <DataTable columns={columns} data={memoizedData} />
    </>
  )
}

export default Quote