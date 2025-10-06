// Wizualizacja workflow i przepływu danych – React + D3.js (lub Plotly)
// npm install react-flow-renderer
import React from "react";
import ReactFlow, { MiniMap, Controls } from "react-flow-renderer";
const nodes = [
  { id: "T1", data: { label: "Tłumacz" }, position: { x: 50, y: 50 } },
  { id: "A1", data: { label: "Analityk" }, position: { x: 250, y: 50 } },
  { id: "D1", data: { label: "Dashboard" }, position: { x: 450, y: 50 } },
];
const edges = [
  { id: "e1-2", source: "T1", target: "A1", label: "przetłumacz" },
  { id: "e2-3", source: "A1", target: "D1", label: "analizuj" },
];
export default () => (
  <div style={{width:"100%",height:350}}>
    <ReactFlow elements={[...nodes, ...edges]}>
      <MiniMap />
      <Controls />
    </ReactFlow>
  </div>
);