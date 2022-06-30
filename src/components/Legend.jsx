import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import * as d3 from "d3";

export function getDataViz2(
  color,
  applicationType,
  average,
  standardDeviation
) {
  return { color, applicationType, average, standardDeviation };
}

export function LegendViz1(props) {
  const { variableName, downloadsMetric, avg, std, top, low, nValues } = props;
  return (
    top &&
    low && (
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
            <TableRow
              key={"variable"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Variable étudiée
              </TableCell>
              <TableCell align="right">{variableName}</TableCell>
            </TableRow>

            <TableRow
              key={"nValues"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Nombre de valeurs
              </TableCell>
              <TableCell align="right">{nValues}</TableCell>
            </TableRow>
            <TableRow
              key={"Métrique de téléchargements"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Métrique de téléchargements
              </TableCell>
              <TableCell align="right">{downloadsMetric}</TableCell>
            </TableRow>
            {
              <TableRow
                key={"Moyenne "}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Moyenne des valeurs
                </TableCell>
                <TableCell align="right">{avg}</TableCell>
              </TableRow>
            }
            {
              <TableRow
                key={"std"}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Écart type
                </TableCell>
                <TableCell align="right">{std}</TableCell>
              </TableRow>
            }

            <TableRow
              key={"first "}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">
                {"Valeur en première position : " + top[0]}
              </TableCell>
              <TableCell align="right">
                {"Téléchargements : " + d3.format(".2f")(top[1])}
              </TableCell>
            </TableRow>
            <TableRow
              key={"last"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">
                {"Valeur en denière position " + low[0]}
              </TableCell>
              <TableCell align="right">
                {"Téléchargements : " + d3.format(".2f")(low[1])}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
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
