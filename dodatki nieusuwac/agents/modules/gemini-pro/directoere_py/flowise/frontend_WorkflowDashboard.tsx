import React from "react";
import ReactFlow, { MiniMap, Controls } from "react-flow-renderer";
const nodes = [
  { id: "input", data: { label: "Input" }, position: { x: 50, y: 100 } },
  { id: "gemini", data: { label: "Gemini" }, position: { x: 250, y: 80 } },
  { id: "bielik", data: { label: "Bielik" }, position: { x: 450, y: 140 } },
  { id: "llama", data: { label: "Llama3" }, position: { x: 650, y: 200 } },
  { id: "dashboard", data: { label: "Dashboard" }, position: { x: 850, y: 120 } },
  { id: "output", data: { label: "Output" }, position: { x: 1050, y: 100 } }
];
const edges = [
  { id: "e-input-gemini", source: "input", target: "gemini", label: "prompt" },
  { id: "e-gemini-bielik", source: "gemini", target: "bielik", label: "response" },
  { id: "e-bielik-llama", source: "bielik", target: "llama", label: "response" },
  { id: "e-llama-dashboard", source: "llama", target: "dashboard", label: "result" },
  { id: "e-dashboard-output", source: "dashboard", target: "output", label: "final" }
];
export default () => (
  <div style={{width:"100%",height:400}}>
    <ReactFlow elements={[...nodes, ...edges]}><MiniMap /><Controls /></ReactFlow>
  </div>
);