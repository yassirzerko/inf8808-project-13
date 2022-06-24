import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createDataViz1(label, value) {
  return { label, value };
}

const rowsViz1 = [
  createDataViz1('Moyenne', 500000),
  createDataViz1('Écart type', 250000),
  createDataViz1('Minimum', 100000),
  createDataViz1('Maximum', 150000),
  createDataViz1('Nombre de valeurs', 22),
];

function createDataViz2(color, applicationType, average, standardDeviation) {
  return { color, applicationType, average, standardDeviation };
}

const rowsViz2 = [
  createDataViz2('red', 'Applications payantes', 500000, 250000),
  createDataViz2('blue', 'Applications gratuites', 500000, 250000),
];

export function LegendViz1() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2}>Statistiques</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsViz1.map((row) => (
            <TableRow
              key={row.label}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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

export function LegendViz2() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Type d'application</TableCell>
            <TableCell align="center">Moyenne des notes</TableCell>
            <TableCell align="center">Écart type des notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsViz2.map((row) => (
            <TableRow
              key={row.applicationType}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <div style={{backgroundColor: row.color, width: 25, height: 25, display: 'inline-block'}}>&nbsp;</div>
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