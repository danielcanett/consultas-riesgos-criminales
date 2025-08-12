import React from "react";
import { Bar } from "recharts";

export default function DashboardCharts({ results }) {
  // Puedes hacer un gráfico de barras de probabilidades por escenario
  if (!results || !results.summary) return null;
  const data = results.summary.map(row => ({
    name: row.escenario,
    prob: parseFloat(row.probabilidad)
  }));

  return (
    <div className="dashboard-charts">
      <h3>Gráfica de Probabilidad por Escenario</h3>
      <Bar data={data} dataKey="prob" />
    </div>
  );
}