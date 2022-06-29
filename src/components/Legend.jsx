import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createDataViz1(label, value) {
  return { label, value };
}

const rowsViz1 = [
  // add variable etudie et metrique de telechargement
  createDataViz1("Moyenne", 500000),
  createDataViz1("Écart type", 250000),
  createDataViz1("Plus grande valeur", 100000),
  createDataViz1("Plus petite valeur", 150000),
  createDataViz1("Nombre de valeurs pour la variable", 22),
];

export function getDataViz2(
  color,
  applicationType,
  average,
  standardDeviation
) {
  return { color, applicationType, average, standardDeviation };
}

export function LegendViz1(props) {
  const {avg, std, top, low, nValues} = props
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2}>
              Statistiques
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsViz1.map((row) => (
            <TableRow
              key={row.label}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.label}:
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function LegendViz2(props) {
  const { data } = props;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Type d'application</TableCell>
            <TableCell align="center">Nombre moyen de revues</TableCell>
            <TableCell align="center">Note moyenne</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.applicationType}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <div
                  style={{
                    backgroundColor: row.color,
                    width: 25,
                    height: 25,
                    display: "inline-block",
                    margin: 2,
                  }}
                >
                  &nbsp;
                </div>
                {row.applicationType}
              </TableCell>
              <TableCell align="right">{row.average}</TableCell>
              <TableCell align="right">{row.standardDeviation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
