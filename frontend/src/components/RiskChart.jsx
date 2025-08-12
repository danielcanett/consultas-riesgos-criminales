import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from "recharts";
import { Typography, Box } from "@mui/material";

function RiskChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Typography align="center" color="textSecondary">
        No hay datos de riesgos para mostrar. Calcula un riesgo para ver la gráfica.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 320 }}>
      <Typography variant="h6" gutterBottom align="center">
        Probabilidad de Riesgo por Escenario
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 32, left: 8, bottom: 32 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="scenario"
            angle={-15}
            textAnchor="end"
            interval={0}
            height={60}
            tick={{ fontSize: 13 }}
          />
          <YAxis 
            tick={{ fontSize: 13 }}
            label={{
              value: "Probabilidad (%)",
              angle: -90,
              position: "insideLeft",
              fontSize: 13
            }}
          />
          <Tooltip formatter={(val) => `${val}%`} />
          <Bar dataKey="probability" fill="#1976d2" radius={[6,6,0,0]}>
            <LabelList dataKey="probability" position="top" formatter={val => `${val}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default RiskChart;