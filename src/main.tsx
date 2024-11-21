import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData } from "./makeData";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: "Info",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "age",
        header: () => "Age",
        footer: (props) => props.column.id,
      },
      {
        header: "More Info",
        columns: [
          {
            accessorKey: "visits",
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "status",
            header: "Status",
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "progress",
            header: "Profile Progress",
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
];

function App() {
  const [data] = React.useState(() => makeData(1000));
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);

  const rerender = React.useReducer(() => ({}), {})[1];

  // Create the table and pass your options
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Manage your own state
  const [state, setState] = React.useState(table.initialState);

  // Override the state managers for the table to your own
  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    // These are just table options, so if things
    // need to change based on your state, you can
    // derive them here

    // Just for fun, let's debug everything if the pageIndex
    // is greater than 2
    debugTable: state.pagination.pageIndex > 2,
  }));

  return (
    <div style={{ padding: "4px" }}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ position: "relative", width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? "isResizing" : ""
                      }`}
                    ></div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          gap: "8px",
        }}
      >
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          {">>"}
        </button>
        <span className="pagination-page-info">
          <strong>{table.getState().pagination.pageIndex + 1}</strong>
          <span>of</span>
          <strong>{table.getPageCount()}</strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="pagination-select"
        >
          {[1, 10, 20, 30, 40, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="h-4" />
      <button onClick={() => rerender()} className="pagination-button">
        Rerender
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
