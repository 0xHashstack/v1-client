// import { render, screen, fireEvent } from "@testing-library/react";
// import SpendTable from "../src/components/layouts/table/spendTable";

// describe("SpendTable component", () => {
//   beforeEach(() => {
//     render(<SpendTable />);
//   });

//   test("displays warning box by default", () => {
//     const warningBox = screen.getByText(/Only unspent loans are displayed/i);
//     expect(warningBox).toBeInTheDocument();
//   });

//   test("hides warning box when close button is clicked", () => {
//     const closeButton = screen.getByTestId("close-button");
//     fireEvent.click(closeButton);
//     const warningBox = screen.queryByText(/Only unspent loans are displayed/i);
//     expect(warningBox).not.toBeInTheDocument();
//   });

//   test("renders table with correct column headers", () => {
//     const columnHeaders = screen.getAllByRole("columnheader");
//     const expectedHeaders = [
//       "Borrow ID",
//       "Borrowed",
//       "Effective APR",
//       "LTV",
//       "Health factor",
//     ];
//     expect(columnHeaders).toHaveLength(expectedHeaders.length);
//     columnHeaders.forEach((header, index) => {
//       expect(header).toHaveTextContent(expectedHeaders[index]);
//     });
//   });

//   test("renders table rows with correct data", () => {
//     const rows = screen.getAllByRole("row");
//     // Exclude the table header row
//     const dataRows = rows.slice(1);
//     const expectedData = [
//       ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12346", "rBTC", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12347", "rETH", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12348", "rUSDT", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12349", "rBTC", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12350", "rETH", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12351", "rUSDT", "10,324.556", "BTC", "00.00%"],
//       ["Borrow ID 12352", "rBTC", "10,324.556", "BTC", "00.00%"],
//     ];

//     expect(dataRows).toHaveLength(expectedData.length);
//     dataRows.forEach((row, index) => {
//       const cells = within(row).getAllByRole("cell");
//       expect(cells).toHaveLength(expectedData[index].length);
//       cells.forEach((cell, cellIndex) => {
//         expect(cell).toHaveTextContent(expectedData[index][cellIndex]);
//       });
//     });
//   });

//   test("selects a row and sets selectedDapp state on row click", () => {
//     const row = screen.getByRole("row", { name: /Borrow ID 12345/i });
//     fireEvent.click(row);
//     expect(screen.getByText(/trade/i)).toBeInTheDocument();
//     expect(screen.getByText(/ID - 12345/i)).toBeInTheDocument();
//     expect(screen.getByText(/rUSDT/i)).toBeInTheDocument();
//   });

//   // Add more test cases as needed
// });
