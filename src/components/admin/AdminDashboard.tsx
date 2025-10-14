import React, { useState, useEffect } from "react";
import {
  AuthService,
  type AdminUser,
  AUTH_STORAGE_KEYS,
} from "../../utils/auth";
// import PolaczekDyrektorPanel from './PolaczekDyrektorPanel.svelte';
// import ConfigurationManager from './ConfigurationManager.svelte';
import WorkersStatusDashboard from "./WorkersStatusDashboard";
import MCPServersPanel from "./MCPServersPanel";
import TicketsTable from "./TicketsTable";
import UsersTable from "./UsersTable";

// MyBonzo Admin Dashboard - Enhanced Security React Component
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check stored auth on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (token) {
      const verifiedUser = AuthService.verifyToken(token);
      if (verifiedUser) {
        setUser(verifiedUser);
        setIsAuthenticated(true);
        // Update last activity
        localStorage.setItem(
          AUTH_STORAGE_KEYS.LAST_ACTIVITY,
          Date.now().toString()
        );
      } else {
        // Token invalid, clear storage
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      }
    }
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setLoginError("Wprowadź nazwę użytkownika i hasło!");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const token = AuthService.authenticate(username, password);
      if (token) {
        const authenticatedUser = AuthService.verifyToken(token);
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setIsAuthenticated(true);
          localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
          localStorage.setItem(
            AUTH_STORAGE_KEYS.USER,
            JSON.stringify(authenticatedUser)
          );
          localStorage.setItem(
            AUTH_STORAGE_KEYS.LAST_ACTIVITY,
            Date.now().toString()
          );
          console.log(
            `Login successful! Welcome ${authenticatedUser.username} (${authenticatedUser.role})`
          );
        }
      } else {
        setLoginError("Niepoprawne dane logowania!");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Błąd podczas logowania. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Czy na pewno chcesz się wylogować?")) {
      setIsAuthenticated(false);
      setUser(null);
      setUsername("");
      setPassword("");
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  // Auto-logout on token expiry
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
        if (token) {
          const verifiedUser = AuthService.verifyToken(token);
          if (!verifiedUser) {
            handleLogout();
          }
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // MyBonzo Styles
  const styles = {
    container: {
      minHeight: "100vh",
      background: `
        linear-gradient(rgba(0, 215, 239, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 215, 239, 0.1) 1px, transparent 1px),
        linear-gradient(rgba(0, 215, 239, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 215, 239, 0.05) 1px, transparent 1px),
        #000000
      `,
      backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
      color: "#00e7ff",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      padding: "2rem",
    },
    loginScreen: {
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      textAlign: "center" as const,
    },
    loginBox: {
      background: "rgba(0, 0, 0, 0.6)",
      border: "2px solid #00d7ef",
      borderRadius: "0px",
      padding: "2rem",
      backdropFilter: "blur(10px)",
      boxShadow: "0 0 30px rgba(0, 215, 239, 0.5)",
      minWidth: "300px",
    },
    loginTitle: {
      color: "#00e7ff",
      fontSize: "2rem",
      marginBottom: "2rem",
      textShadow: "0 0 10px rgba(0, 231, 255, 0.5)",
    },
    inputGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#00e7ff",
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      background: "rgba(0, 0, 0, 0.6)",
      border: "2px solid #00d7ef",
      borderRadius: "0px",
      color: "#00e7ff",
      fontSize: "1rem",
      outline: "none",
    },
    button: {
      background: "linear-gradient(45deg, #00e7ff, #0099cc)",
      border: "none",
      borderRadius: "0px",
      padding: "0.75rem 2rem",
      color: "#000",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "1rem",
      transition: "all 0.3s ease",
    },
    error: {
      color: "#00d7ef",
      background: "rgba(0, 0, 0, 0.6)",
      border: "2px solid #00d7ef",
      borderRadius: "0px",
      padding: "0.5rem",
      margin: "0.5rem 0",
    },
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginScreen}>
          <div style={styles.loginBox}>
            <h1 style={styles.loginTitle}>Panel Administracyjny</h1>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>
                Nazwa użytkownika:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                placeholder="Wprowadź login..."
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Hasło:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                placeholder="Wprowadź hasło..."
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleLogin}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
            {loginError && <div style={styles.error}>{loginError}</div>}

            {/* Login hints for demo */}
            <div
              style={{
                ...styles.error,
                borderColor: "#00e7ff",
                color: "#00e7ff",
                fontSize: "0.8rem",
                marginTop: "1rem",
              }}
            >
              <strong>Demo Accounts:</strong>
              <br />
              Admin: admin / HAOS77
              <br />
              Moderator: moderator / MOD2025
              <br />
              Viewer: viewer / VIEW2025
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AdminDashboardContent user={user} onLogout={handleLogout} />
    </div>
  );
}

// Admin Dashboard Content Component
function AdminDashboardContent({
  user,
  onLogout,
}: {
  user: AdminUser | null;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Blade Runner Quote */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          border: "2px solid #00d7ef",
          borderRadius: "0px",
          padding: "2rem",
          marginBottom: "2rem",
          fontStyle: "italic",
          color: "#ffd700",
          textAlign: "center",
          backdropFilter: "blur(5px)",
          fontSize: "1.8rem",
          fontWeight: 600,
          lineHeight: "1.4",
        }}
      >
        "I've seen things you people wouldn't believe. Attack ships on fire off
        the shoulder of Orion. I watched C-beams glitter in the dark near the
        Tannhäuser Gate. All those moments will be lost in time, like tears in
        rain."
        <br />
        <em>- Blade Runner</em>
      </div>

      {/* Dashboard Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            color: "#00e7ff",
            fontSize: "2.5rem",
            textShadow: "0 0 15px rgba(0, 231, 255, 0.7)",
          }}
        >
          MyBonzo Admin Panel
        </h1>

        {/* User Info */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            border: "2px solid #00d7ef",
            padding: "1rem",
            borderRadius: "0px",
            color: "#00e7ff",
          }}
        >
          <div style={{ fontSize: "0.9rem" }}>
            Logged in as: <strong>{user?.username}</strong>
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
            Role: {user?.role?.toUpperCase()} | Permissions:{" "}
            {user?.permissions?.length || 0}
          </div>
        </div>
      </div>

      {/* React Components Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <PanelStats />
        <StatusBox />
        <TrafficChart />
        <BackupManager />
        <WorkersStatusDashboard />
        <MCPServersPanel />
        {user?.role === "superadmin" && (
          <>
            {/* <div style={{ gridColumn: '1 / -1' }}>
              <PolaczekDyrektorPanel />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ConfigurationManager />
            </div> */}
            <div style={{ gridColumn: "1 / -1" }}>
              <UsersTable />
            </div>
          </>
        )}
        <div style={{ gridColumn: "1 / -1" }}>
          <TicketsTable />
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "linear-gradient(45deg, #00d7ef, #1ec7d3)",
          border: "none",
          borderRadius: "0px",
          padding: "0.75rem 2rem",
          color: "#000",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "1rem",
          zIndex: 1000,
        }}
      >
        Wyloguj się
      </button>
    </>
  );
}

// PanelStats Component
function PanelStats() {
  const [stats, setStats] = useState({
    visitors: 0,
    queries: 0,
    uptime: "0:00:00",
    responseTime: 0,
    storage: 0,
    bandwidth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              AUTH_STORAGE_KEYS.TOKEN
            )}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data as any);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace",
  };

  if (loading) {
    return <div style={cardStyle}>Loading stats...</div>;
  }

  return (
    <div style={cardStyle}>
      <h3
        style={{
          marginBottom: "20px",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "#00e7ff",
        }}
      >
        📊 SYSTEM STATISTICS
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "15px",
        }}
      >
        <StatCard label="VISITORS" value={stats.visitors.toLocaleString()} />
        <StatCard label="AI QUERIES" value={stats.queries.toLocaleString()} />
        <StatCard label="UPTIME" value={stats.uptime} />
        <StatCard label="RESPONSE TIME" value={stats.responseTime + "ms"} />
        <StatCard label="STORAGE" value={stats.storage + "GB"} />
        <StatCard label="BANDWIDTH" value={stats.bandwidth + "GB"} />
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#000",
        border: "1px solid #00e7ff",
        padding: "15px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "11px", marginTop: "5px" }}>{label}</div>
    </div>
  );
}

// StatusBox Component
function StatusBox() {
  const [status, setStatus] = useState<{ services: any[]; system: any }>({
    services: [],
    system: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/admin/status", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              AUTH_STORAGE_KEYS.TOKEN
            )}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStatus(data as any);
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace",
  };

  if (loading) {
    return <div style={cardStyle}>Loading system status...</div>;
  }

  return (
    <div style={cardStyle}>
      <h3
        style={{
          marginBottom: "20px",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        ⚡ SYSTEM STATUS
      </h3>
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ marginBottom: "10px", color: "#00e7ff" }}>Services:</h4>
        {status.services.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666" }}>
            No services data
          </div>
        ) : (
          status.services.map((service: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                background: "#000",
                border: "1px solid #333",
                marginBottom: "5px",
              }}
            >
              <span>{service.name}</span>
              <span
                style={{
                  color:
                    service.status === "online"
                      ? "#00ff00"
                      : service.status === "degraded"
                      ? "#ffff00"
                      : "#ff0000",
                }}
              >
                {service.status.toUpperCase()}
                {service.responseTime && ` (${service.responseTime}ms)`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// TrafficChart Component
function TrafficChart() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              AUTH_STORAGE_KEYS.TOKEN
            )}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data as any);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 300000);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace",
  };

  if (loading) {
    return <div style={cardStyle}>📈 Loading analytics...</div>;
  }

  if (!analytics) {
    return (
      <div
        style={{
          ...cardStyle,
          borderColor: "#ff9900",
          color: "#ff9900",
        }}
      >
        📈 Analytics data unavailable
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h3
        style={{
          marginBottom: "20px",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        📈 TRAFFIC ANALYTICS
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <StatCard label="REAL-TIME USERS" value={analytics.realTimeUsers} />
        <StatCard
          label="TOTAL SESSIONS"
          value={analytics.totalSessions.toLocaleString()}
        />
        <StatCard label="BOUNCE RATE" value={analytics.bounceRate + "%"} />
        <StatCard
          label="AVG SESSION"
          value={Math.floor(analytics.avgSessionDuration / 60) + "m"}
        />
      </div>
    </div>
  );
}

// BackupManager Component
function BackupManager() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("");
  const [message, setMessage] = useState("");

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/backup", {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("mybonzo_admin_token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBackups((data as any).backups || []);
        setLastRefresh(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
      setMessage("Error loading backups");
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (reason: string = "manual") => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + localStorage.getItem("mybonzo_admin_token"),
        },
        body: JSON.stringify({ action: "create", reason }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("✅ Backup created successfully!");
        fetchBackups();
      } else {
        setMessage("❌ Failed to create backup");
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      setMessage("❌ Error creating backup");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        border: "2px solid #00e7ff",
        borderRadius: "0px",
        padding: "20px",
        color: "#00e7ff",
        fontFamily: "monospace",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        💾 BACKUP MANAGER
      </h3>

      {/* Backup Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          padding: "10px",
          background: "#111",
          border: "1px solid #333",
        }}
      >
        <span>Backups: {backups.length}/5</span>
        <span>Last: {lastRefresh}</span>
        <div>
          <button
            onClick={() => createBackup("manual")}
            disabled={loading}
            style={{
              background: "#00e7ff",
              color: "#000",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            {loading ? "Creating..." : "Create Backup"}
          </button>
          <button
            onClick={fetchBackups}
            disabled={loading}
            style={{
              background: "#00e7ff",
              color: "#000",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: "10px",
            background: message.includes("✅") ? "#003300" : "#330000",
            border: `1px solid ${
              message.includes("✅") ? "#00ff00" : "#ff0000"
            }`,
            marginBottom: "10px",
            color: message.includes("✅") ? "#00ff00" : "#ff6666",
          }}
        >
          {message}
        </div>
      )}

      {/* Backup List */}
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {backups.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            No backups found
          </div>
        ) : (
          backups.map((backup, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                background: "#000",
                border: "1px solid #333",
                marginBottom: "5px",
              }}
            >
              <div>
                <div style={{ fontSize: "0.9rem" }}>{backup.name}</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                  {new Date(backup.date).toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#00ff00" }}>
                {backup.age || "Active"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Backup Buttons */}
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "5px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => createBackup("before_deploy")}
          disabled={loading}
          style={{
            background: "#ff9900",
            color: "#000",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Pre-Deploy
        </button>
        <button
          onClick={() => createBackup("feature_update")}
          disabled={loading}
          style={{
            background: "#9900ff",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Feature Update
        </button>
        <button
          onClick={() => createBackup("config_change")}
          disabled={loading}
          style={{
            background: "#00ff99",
            color: "#000",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Config Change
        </button>
      </div>
    </div>
  );
}
