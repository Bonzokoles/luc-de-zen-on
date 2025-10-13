import React, { useState } from "react";

interface AgentResponse {
  success: boolean;
  response?: string;
  error?: string;
  timestamp: string;
}

interface AgentStatus {
  status: string;
  lastActivity: string | null;
  stats: {
    messagesCount: number;
    imagesGenerated: number;
    tasksCompleted: number;
  };
  conversationLength: number;
}

export function MyBonzoAgentTest() {
  const [agentId, setAgentId] = useState("test-user-123");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://mybonzo-agent.your-domain.workers.dev"; // Zmień na swój URL

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/mybonzo-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          message,
          model: "@cf/google/gemma-3-12b-it",
        }),
      });

      const data = await res.json();
      setResponse(data as any);
      setMessage("");
    } catch (error) {
      setResponse({
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const getStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/mybonzo-status?id=${agentId}`);
      const data = await res.json();
      setStatus(data as any);
    } catch (error) {
      console.error("Status error:", error);
    }
    setLoading(false);
  };

  const executeTask = async (taskType: string, taskData: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/mybonzo-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          taskType,
          taskData,
        }),
      });

      const data = (await res.json()) as any;
      setResponse(data.result);
    } catch (error) {
      setResponse({
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    try {
      await fetch(`${API_BASE}/api/mybonzo-clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      setResponse(null);
      setStatus(null);
    } catch (error) {
      console.error("Clear error:", error);
    }
  };

  return (
    <div
      className="mybonzo-agent-test"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Orbitron, monospace",
        background: "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
        color: "#00fff3",
        borderRadius: "10px",
        border: "1px solid #00fff3",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🤖 MyBonzo Agent Test Interface
      </h2>

      {/* Agent ID Input */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Agent ID:
        </label>
        <input
          type="text"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            background: "#0a0a0a",
            border: "1px solid #00fff3",
            color: "#00fff3",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Chat Interface */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Message:
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Napisz wiadomość do agenta..."
            style={{
              flex: 1,
              padding: "10px",
              background: "#0a0a0a",
              border: "1px solid #00fff3",
              color: "#00fff3",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            style={{
              padding: "10px 20px",
              background: "#00fff3",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "⏳" : "🚀"}
          </button>
        </div>
      </div>

      {/* Quick Tasks */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Quick Tasks:
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => executeTask("research", { topic: "AI w 2025 roku" })}
            disabled={loading}
            style={{
              padding: "8px 15px",
              background: "#16213e",
              color: "#00fff3",
              border: "1px solid #00fff3",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🔍 Research
          </button>
          <button
            onClick={() =>
              executeTask("creative", {
                prompt: "futurystyczne miasto",
                style: "cyberpunk",
              })
            }
            disabled={loading}
            style={{
              padding: "8px 15px",
              background: "#16213e",
              color: "#00fff3",
              border: "1px solid #00fff3",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🎨 Creative
          </button>
          <button
            onClick={() =>
              executeTask("code", { request: "Przykład React komponentu" })
            }
            disabled={loading}
            style={{
              padding: "8px 15px",
              background: "#16213e",
              color: "#00fff3",
              border: "1px solid #00fff3",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            💻 Code Help
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={getStatus}
          disabled={loading}
          style={{
            padding: "10px 15px",
            background: "#0066cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          📊 Status
        </button>
        <button
          onClick={clearHistory}
          disabled={loading}
          style={{
            padding: "10px 15px",
            background: "#cc3300",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🧹 Clear History
        </button>
      </div>

      {/* Response Display */}
      {response && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: response.success ? "#003300" : "#330000",
            border: `1px solid ${response.success ? "#00ff00" : "#ff0000"}`,
            borderRadius: "5px",
          }}
        >
          <h4>{response.success ? "✅ Response:" : "❌ Error:"}</h4>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
            {response.response || response.error}
          </p>
          <small style={{ opacity: 0.7 }}>
            {new Date(response.timestamp).toLocaleString()}
          </small>
        </div>
      )}

      {/* Status Display */}
      {status && (
        <div
          style={{
            padding: "15px",
            background: "#001a33",
            border: "1px solid #0066cc",
            borderRadius: "5px",
          }}
        >
          <h4>📊 Agent Status</h4>
          <p>
            <strong>Status:</strong> {status.status}
          </p>
          <p>
            <strong>Messages:</strong> {status.stats.messagesCount}
          </p>
          <p>
            <strong>Images Generated:</strong> {status.stats.imagesGenerated}
          </p>
          <p>
            <strong>Tasks Completed:</strong> {status.stats.tasksCompleted}
          </p>
          <p>
            <strong>Conversation Length:</strong> {status.conversationLength}
          </p>
          <p>
            <strong>Last Activity:</strong>{" "}
            {status.lastActivity
              ? new Date(status.lastActivity).toLocaleString()
              : "Never"}
          </p>
        </div>
      )}

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#ffff00",
          }}
        >
          ⏳ Processing...
        </div>
      )}
    </div>
  );
}

export default MyBonzoAgentTest;
