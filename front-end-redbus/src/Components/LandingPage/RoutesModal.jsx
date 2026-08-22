import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(source, destination, buses) {
  return { source, destination, buses };
}

const rows = [
  createData("Lucknow", "Faizabad", 12),
  createData("Allahabad", "Lucknow", 1),
  createData("Lucknow", "Allahabad", 1),
  createData("Lucknow", "Delhi", 1),
];

export default function RoutesModal() {
  return (
    <div>
      <div>
        <b style={{ color: "red", fontSize: "20px", height: "70px" }}>
          Note: Currently we are serving our customers only in the below
          mentioned routes.
        </b>
        <br />
        <b style={{ color: "green", fontSize: "16px", height: "70px" }}>
          Suggestion: To test all the features, select the route with maximum
          number of buses.
        </b>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>SOURCE</strong>
              </TableCell>
              <TableCell align="right">
                <strong>DESTINATION</strong>
              </TableCell>
              <TableCell align="right">
                <strong>BUS COUNT</strong>&nbsp;
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.source}>
                <TableCell component="th" scope="row">
                  {row.source}
                </TableCell>
                <TableCell align="right">{row.destination}</TableCell>
                <TableCell align="right">{row.buses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
