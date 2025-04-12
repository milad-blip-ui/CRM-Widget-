import React from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";

const DataTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Use `page` instead of `rows` for pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative ">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            id="default-search"
            className="block pl-10 rounded-md text-sm text-gray-900   border border-gray-200 focus:ring-0 focus:border-primary"
            placeholder="Search"
            required
          />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full text-sm text-left rtl:text-right text-gray-500"
        >
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3"
                    key={column.id}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {data.length === 0 ? ( // Check if data is empty
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center"
                >
                  No data found
                </td>
              </tr>
            ) : (
              page.map((row) => {
                // Use `page` instead of `rows`
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps(); // Get cell props
                      return (
                        <td
                          {...cellProps}
                          className="px-6 py-4 whitespace-nowrap"
                          key={`${row.id}-${cell.column.id}`}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <nav className="inline-flex items-center p-1 rounded bg-white space-x-2">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="p-1 rounded border text-black bg-white hover:text-white hover:bg-primary hover:border-primary"
              type="button"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
            <p className="text-gray-500">
              Page {pageIndex + 1} of {pageOptions.length}
            </p>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="p-1 rounded border text-black bg-white hover:text-white hover:bg-primary hover:border-primary"
              type="button"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </nav>
        </div>
        <div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="w-28 text-sm text-gray-600 border-gray-200 rounded focus:ring-white focus:border-primary"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DataTable;