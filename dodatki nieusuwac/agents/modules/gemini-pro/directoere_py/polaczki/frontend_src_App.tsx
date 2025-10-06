// React/TypeScript – Panel webowy: monitoring, workflow, logi, CRUD agentów, wykresy
import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

function App() {
  const [agents, setAgents] = useState([]);
  const [workflow, setWorkflow] = useState("");
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [aiResponse, setAIResponse] = useState("");
  
  useEffect(() => {
    axios.get("/api/agents").then(res => setAgents(res.data));
    axios.get("/api/logs").then(res => setLogs(res.data));
    axios.get("/api/metrics").then(res => setMetrics(res.data));
  }, []);
  
  const runWorkflow = async () => {
    const steps = workflow.split("->").map(x => ({
      agent_id: x.trim(),
      payload: {}
    }));
    const res = await axios.post("/api/workflow", { steps });
    alert(JSON.stringify(res.data.results, null, 2));
  };
  
  const callAI = async (model: string, prompt: string) => {
    const res = await axios.post(`/api/ai/${model}`, { prompt });
    setAIResponse(res.data.response);
  };
  
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:24}}>
      <h2>POLACZEK Dashboard (React)</h2>
      <div>
        <input placeholder="Workflow T1->A1->D1" value={workflow} onChange={e=>setWorkflow(e.target.value)}/>
        <button onClick={runWorkflow}>Run Workflow</button>
      </div>
      <div>
        <input placeholder="AI prompt..." onBlur={e=>callAI("gemini",e.target.value)}/>
        <div>AI Response: {aiResponse}</div>
      </div>
      <h3>Agents</h3>
      <table><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Role</th><th>Status</th><th>Endpoint</th></tr></thead>
        <tbody>
          {agents.map(a=><tr key={a.id}><td>{a.id}</td><td>{a.name}</td><td>{a.type}</td><td>{a.role}</td><td>{a.status}</td><td>{a.endpoint}</td></tr>)}
        </tbody>
      </table>
      <h3>Logs</h3>
      <ul>{logs.map((l,i)=><li key={i}>[{l.timestamp}] [{l.level}] {l.message} ({l.agent})</li>)}</ul>
      <h3>Live Metrics</h3>
      <Plot
        data={[
          {x:metrics.map(m=>m.timestamp),y:metrics.map(m=>m.cpu_percent),type:"scatter",name:"CPU %"},
          {x:metrics.map(m=>m.timestamp),y:metrics.map(m=>m.memory_percent),type:"scatter",name:"RAM %"}
        ]}
        layout={{width:600,height:300,title:"CPU/RAM Live"}}
      />
    </div>
  );
}
export default App;