import React, { useMemo } from 'react';
import DataTable from '../Shared/DataTable'
//import { salesorderData } from '../../data'
import Badge from "../shared/Badge"
const Salesorder = ({data}) => {
    const columns = useMemo(
      () => [
        {
          Header: 'Order#',
          accessor: 'salesorder',
          Cell: ({ row }) => (
            <span className="font-medium text-brand-500">{row.original.salesorder}</span>
          ),
        },
        { Header: 'name', accessor: 'soname' },
        { Header: 'Status', accessor: 'status', 
          Cell: ({ row }) => (
            <Badge size="sm" color="success">{row.original.status || "In Process"}</Badge> 
            // row.original.status === "Draft" ? <Badge size="sm" color="light">Draft</Badge> : 
            //     row.original.status === "Sent to design" ? <Badge size="sm" color="success">Sent to design</Badge> : 
            //     row.original.status === "In Process" ? <Badge size="sm" color="info">In Process</Badge> :  
            //     <Badge size="sm" color="warning">Unknown</Badge>
          ),
        },
        { Header: 'date', accessor: 'so_date' },
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
    console.log(`Row ID: ${id}`); // You can replace this with any action you want to perform
  };
  const memoizedData = useMemo(() => {
    return data.map(row => ({
      id: row.ID, 
      salesorder: row.Salesorder.replace(/^SO-/, ''),
      soname: row.SO_name,
      status: row.Portal_Status,
      so_date: row.SO_Date,
      // Post_production: row.Post_production
      total: row.Total,
      // balance: `${row.currency_symbol}${row.balance}.00`
    }));
  }, [data]);
  return (
    <>
     <DataTable columns={columns} data={memoizedData} />
    </>
  )
}
export default Salesorder