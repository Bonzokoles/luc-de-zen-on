globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_BgZWjcZU.mjs';
import { j as jsxRuntimeExports } from '../../chunks/jsx-runtime_DoH26EBh.mjs';
import { a as reactExports } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
import { $ as $$RandomPolishFonts, a as $$PolishAdminStyles } from '../../chunks/PolishAdminStyles_Cpu94sEU.mjs';
/* empty css                                        */

const AUTH_CONFIG = {
  secretKey: "MYBONZO_SECRET_2025",
  // Should be environment variable in production
  tokenExpiry: 36e5,
  // 1 hour
  roles: {
    admin: ["read", "write", "delete", "manage_users", "system_control"],
    moderator: ["read", "write", "manage_content"],
    viewer: ["read"]
  }
};
const USERS_DB = {
  "admin": { password: "HAOS77", role: "admin" },
  "moderator": { password: "MOD2025", role: "moderator" },
  "viewer": { password: "VIEW2025", role: "viewer" }
};
class AuthService {
  static encode(payload) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    const signature = btoa(`${header}.${body}.${AUTH_CONFIG.secretKey}`);
    return `${header}.${body}.${signature}`;
  }
  static decode(token) {
    try {
      const [header, body, signature] = token.split(".");
      const expectedSignature = btoa(`${header}.${body}.${AUTH_CONFIG.secretKey}`);
      if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
      }
      return JSON.parse(atob(body));
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
  static authenticate(username, password) {
    const user = USERS_DB[username];
    if (!user || user.password !== password) {
      return null;
    }
    const payload = {
      id: username,
      username,
      role: user.role,
      permissions: AUTH_CONFIG.roles[user.role],
      exp: Date.now() + AUTH_CONFIG.tokenExpiry,
      iat: Date.now()
    };
    return this.encode(payload);
  }
  static verifyToken(token) {
    try {
      const payload = this.decode(token);
      if (payload.exp < Date.now()) {
        throw new Error("Token expired");
      }
      return {
        id: payload.id,
        username: payload.username,
        role: payload.role,
        permissions: payload.permissions
      };
    } catch (error) {
      return null;
    }
  }
  static hasPermission(user, permission) {
    return user.permissions.includes(permission);
  }
  static refreshToken(token) {
    const user = this.verifyToken(token);
    if (!user) return null;
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      exp: Date.now() + AUTH_CONFIG.tokenExpiry,
      iat: Date.now()
    };
    return this.encode(payload);
  }
}
const AUTH_STORAGE_KEYS = {
  TOKEN: "mybonzo_admin_token",
  USER: "mybonzo_admin_user",
  LAST_ACTIVITY: "mybonzo_last_activity"
};

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = reactExports.useState(false);
  const [user, setUser] = reactExports.useState(null);
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loginError, setLoginError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (token) {
      const verifiedUser = AuthService.verifyToken(token);
      if (verifiedUser) {
        setUser(verifiedUser);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
      } else {
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
          localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(authenticatedUser));
          localStorage.setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
          console.log(`Login successful! Welcome ${authenticatedUser.username} (${authenticatedUser.role})`);
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
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
        if (token) {
          const verifiedUser = AuthService.verifyToken(token);
          if (!verifiedUser) {
            handleLogout();
          }
        }
      }, 6e4);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
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
      padding: "2rem"
    },
    loginScreen: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      textAlign: "center"
    },
    loginBox: {
      background: "rgba(0, 0, 0, 0.6)",
      border: "2px solid #00d7ef",
      borderRadius: "0px",
      padding: "2rem",
      backdropFilter: "blur(10px)",
      boxShadow: "0 0 30px rgba(0, 215, 239, 0.5)",
      minWidth: "300px"
    },
    loginTitle: {
      color: "#00e7ff",
      fontSize: "2rem",
      marginBottom: "2rem",
      textShadow: "0 0 10px rgba(0, 231, 255, 0.5)"
    },
    inputGroup: {
      marginBottom: "1.5rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#00e7ff",
      fontWeight: 600
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      background: "rgba(0, 0, 0, 0.6)",
      border: "2px solid #00d7ef",
      borderRadius: "0px",
      color: "#00e7ff",
      fontSize: "1rem",
      outline: "none"
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
      transition: "all 0.3s ease"
    },
    error: {
      color: "#00d7ef",
      background: "rgba(0, 0, 0, 0.6)",
      border: "2px solid #00d7ef",
      borderRadius: "0px",
      padding: "0.5rem",
      margin: "0.5rem 0"
    }
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: styles.container, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: styles.loginScreen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: styles.loginBox, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: styles.loginTitle, children: "Panel Administracyjny" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: styles.inputGroup, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "username", style: styles.label, children: "Nazwa użytkownika:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            id: "username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            onKeyPress: handleKeyPress,
            style: styles.input,
            placeholder: "Wprowadź login...",
            autoComplete: "username",
            disabled: loading
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: styles.inputGroup, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", style: styles.label, children: "Hasło:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            id: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            onKeyPress: handleKeyPress,
            style: styles.input,
            placeholder: "Wprowadź hasło...",
            autoComplete: "current-password",
            disabled: loading
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleLogin,
          style: {
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          },
          disabled: loading,
          children: loading ? "Logowanie..." : "Zaloguj się"
        }
      ),
      loginError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: styles.error, children: loginError }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        ...styles.error,
        borderColor: "#00e7ff",
        color: "#00e7ff",
        fontSize: "0.8rem",
        marginTop: "1rem"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Demo Accounts:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Admin: admin / HAOS77",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Moderator: moderator / MOD2025",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Viewer: viewer / VIEW2025"
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: styles.container, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboardContent, { user, onLogout: handleLogout }) });
}
function AdminDashboardContent({ user, onLogout }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
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
      lineHeight: "1.4"
    }, children: [
      `"I've seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. I watched C-beams glitter in the dark near the Tannhäuser Gate. All those moments will be lost in time, like tears in rain."`,
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "- Blade Runner" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        color: "#00e7ff",
        fontSize: "2.5rem",
        textShadow: "0 0 15px rgba(0, 231, 255, 0.7)"
      }, children: "MyBonzo Admin Panel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(0, 0, 0, 0.6)",
        border: "2px solid #00d7ef",
        padding: "1rem",
        borderRadius: "0px",
        color: "#00e7ff"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.9rem" }, children: [
          "Logged in as: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user?.username })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", opacity: 0.8 }, children: [
          "Role: ",
          user?.role?.toUpperCase(),
          " | Permissions: ",
          user?.permissions?.length || 0
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: "2rem",
      marginTop: "2rem"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PanelStats, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBox, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrafficChart, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BackupManager, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WorkersStatusDashboard, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onLogout, style: {
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
      zIndex: 1e3
    }, children: "Wyloguj się" })
  ] });
}
function PanelStats() {
  const [stats, setStats] = reactExports.useState({
    visitors: 0,
    queries: 0,
    uptime: "0:00:00",
    responseTime: 0,
    storage: 0,
    bandwidth: 0
  });
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          headers: { "Authorization": "Bearer HAOS77" }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3e4);
    return () => clearInterval(interval);
  }, []);
  const cardStyle = {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace"
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: cardStyle, children: "Loading stats..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: cardStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
      marginBottom: "20px",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "2px",
      color: "#00e7ff"
    }, children: "📊 SYSTEM STATISTICS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "15px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "VISITORS", value: stats.visitors.toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "AI QUERIES", value: stats.queries.toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "UPTIME", value: stats.uptime }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "RESPONSE TIME", value: stats.responseTime + "ms" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "STORAGE", value: stats.storage + "GB" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "BANDWIDTH", value: stats.bandwidth + "GB" })
    ] })
  ] });
}
function StatCard({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "#000",
    border: "1px solid #00e7ff",
    padding: "15px",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "18px", fontWeight: "bold" }, children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", marginTop: "5px" }, children: label })
  ] });
}
function StatusBox() {
  const [status, setStatus] = reactExports.useState({ services: [], system: {} });
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/admin/status", {
          headers: { "Authorization": "Bearer HAOS77" }
        });
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3e4);
    return () => clearInterval(interval);
  }, []);
  const cardStyle = {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace"
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: cardStyle, children: "Loading system status..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: cardStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
      marginBottom: "20px",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "2px"
    }, children: "⚡ SYSTEM STATUS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { marginBottom: "10px", color: "#00e7ff" }, children: "Services:" }),
      status.services.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#666" }, children: "No services data" }) : status.services.map((service, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px",
        background: "#000",
        border: "1px solid #333",
        marginBottom: "5px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: service.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          color: service.status === "online" ? "#00ff00" : service.status === "degraded" ? "#ffff00" : "#ff0000"
        }, children: [
          service.status.toUpperCase(),
          service.responseTime && ` (${service.responseTime}ms)`
        ] })
      ] }, index))
    ] })
  ] });
}
function TrafficChart() {
  const [analytics, setAnalytics] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics", {
          headers: { "Authorization": "Bearer HAOS77" }
        });
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3e5);
    return () => clearInterval(interval);
  }, []);
  const cardStyle = {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace"
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: cardStyle, children: "📈 Loading analytics..." });
  }
  if (!analytics) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      ...cardStyle,
      borderColor: "#ff9900",
      color: "#ff9900"
    }, children: "📈 Analytics data unavailable" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: cardStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
      marginBottom: "20px",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "2px"
    }, children: "📈 TRAFFIC ANALYTICS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "15px",
      marginBottom: "20px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "REAL-TIME USERS", value: analytics.realTimeUsers }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "TOTAL SESSIONS", value: analytics.totalSessions.toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "BOUNCE RATE", value: analytics.bounceRate + "%" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "AVG SESSION", value: Math.floor(analytics.avgSessionDuration / 60) + "m" })
    ] })
  ] });
}
function WorkersStatusDashboard() {
  const [workers, setWorkers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [lastRefresh, setLastRefresh] = reactExports.useState("");
  const fetchWorkersStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/workers-status", {
        headers: { "Authorization": "Bearer HAOS77" }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkers(data.workers || []);
        setLastRefresh((/* @__PURE__ */ new Date()).toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching workers status:", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchWorkersStatus();
  }, []);
  const onlineWorkers = workers.filter((w) => w.status === "online").length;
  const totalWorkers = workers.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
      marginBottom: "20px",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "2px"
    }, children: "🔧 WORKERS STATUS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      padding: "10px",
      background: "#111",
      border: "1px solid #333"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Online: ",
        onlineWorkers,
        "/",
        totalWorkers
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Last: ",
        lastRefresh
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: fetchWorkersStatus,
          disabled: loading,
          style: {
            background: "#00e7ff",
            color: "#000",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer"
          },
          children: loading ? "Loading..." : "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: "300px", overflowY: "auto" }, children: workers.map((worker, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px",
      background: "#000",
      border: "1px solid #333",
      marginBottom: "5px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: worker.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
        color: worker.status === "online" ? "#00ff00" : worker.status === "partial" ? "#ffff00" : "#ff0000"
      }, children: [
        worker.status.toUpperCase(),
        worker.responseMs ? ` (${worker.responseMs}ms)` : ""
      ] })
    ] }, index)) })
  ] });
}
function BackupManager() {
  const [backups, setBackups] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [lastRefresh, setLastRefresh] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/backup", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("mybonzo_admin_token") }
      });
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
        setLastRefresh((/* @__PURE__ */ new Date()).toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
      setMessage("Error loading backups");
    } finally {
      setLoading(false);
    }
  };
  const createBackup = async (reason = "manual") => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("mybonzo_admin_token")
        },
        body: JSON.stringify({ action: "create", reason })
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
  reactExports.useEffect(() => {
    fetchBackups();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #00e7ff",
    borderRadius: "0px",
    padding: "20px",
    color: "#00e7ff",
    fontFamily: "monospace"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
      marginBottom: "20px",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "2px"
    }, children: "💾 BACKUP MANAGER" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      padding: "10px",
      background: "#111",
      border: "1px solid #333"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Backups: ",
        backups.length,
        "/5"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Last: ",
        lastRefresh
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => createBackup("manual"),
            disabled: loading,
            style: {
              background: "#00e7ff",
              color: "#000",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              marginRight: "5px"
            },
            children: loading ? "Creating..." : "Create Backup"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: fetchBackups,
            disabled: loading,
            style: {
              background: "#00e7ff",
              color: "#000",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer"
            },
            children: "Refresh"
          }
        )
      ] })
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      padding: "10px",
      background: message.includes("✅") ? "#003300" : "#330000",
      border: `1px solid ${message.includes("✅") ? "#00ff00" : "#ff0000"}`,
      marginBottom: "10px",
      color: message.includes("✅") ? "#00ff00" : "#ff6666"
    }, children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: "300px", overflowY: "auto" }, children: backups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#666", padding: "20px" }, children: "No backups found" }) : backups.map((backup, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px",
      background: "#000",
      border: "1px solid #333",
      marginBottom: "5px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem" }, children: backup.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.7rem", opacity: 0.7 }, children: new Date(backup.date).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "#00ff00" }, children: backup.age || "Active" })
    ] }, index)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "15px", display: "flex", gap: "5px", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => createBackup("before_deploy"),
          disabled: loading,
          style: {
            background: "#ff9900",
            color: "#000",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem"
          },
          children: "Pre-Deploy"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => createBackup("feature_update"),
          disabled: loading,
          style: {
            background: "#9900ff",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem"
          },
          children: "Feature Update"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => createBackup("config_change"),
          disabled: loading,
          style: {
            background: "#00ff99",
            color: "#000",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem"
          },
          children: "Config Change"
        }
      )
    ] })
  ] });
}

const MonitoringDashboard = () => {
  const [healthData, setHealthData] = reactExports.useState(null);
  const [errorData, setErrorData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [autoRefresh, setAutoRefresh] = reactExports.useState(true);
  const [selectedTab, setSelectedTab] = reactExports.useState("health");
  const fetchHealthData = async () => {
    try {
      const response = await fetch("/api/health?detailed=true");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      console.error("Failed to fetch health data:", err);
      setError("Failed to load health data");
    }
  };
  const fetchErrorData = async () => {
    try {
      const response = await fetch("/api/errors?limit=50");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setErrorData(data);
    } catch (err) {
      console.error("Failed to fetch error data:", err);
      setError("Failed to load error data");
    }
  };
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchHealthData(), fetchErrorData()]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };
  const clearErrors = async () => {
    try {
      const response = await fetch("/api/errors?action=clear", {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchErrorData();
      }
    } catch (err) {
      console.error("Failed to clear errors:", err);
    }
  };
  reactExports.useEffect(() => {
    loadData();
    if (autoRefresh) {
      const interval = setInterval(loadData, 3e4);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  const StatusBadge = ({ status, children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-badge status-${status}`, children });
  const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1e3);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-loading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading monitoring data..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "monitoring-dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "System Monitoring Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "auto-refresh-toggle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: autoRefresh,
              onChange: (e) => setAutoRefresh(e.target.checked)
            }
          ),
          "Auto-refresh (30s)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadData, className: "refresh-btn", children: "🔄 Refresh" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-error", children: [
      "⚠️ ",
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `tab-btn ${selectedTab === "health" ? "active" : ""}`,
          onClick: () => setSelectedTab("health"),
          children: "System Health"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `tab-btn ${selectedTab === "errors" ? "active" : ""}`,
          onClick: () => setSelectedTab("errors"),
          children: [
            "Error Logs",
            (errorData?.summary.last24Hours || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "error-count", children: errorData?.summary.last24Hours })
          ]
        }
      )
    ] }),
    selectedTab === "health" && healthData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-overview", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Overall Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: healthData.status, children: healthData.status.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Uptime" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "metric-value", children: formatUptime(healthData.uptime) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "metric-value", children: healthData.version })
        ] }),
        healthData.performance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Performance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-value", children: [
            healthData.performance.averageResponseTime.toFixed(1),
            "ms avg"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-detail", children: [
            healthData.performance.requestCount,
            " requests",
            healthData.performance.errorRate > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "error-rate", children: [
              "• ",
              healthData.performance.errorRate.toFixed(1),
              "% errors"
            ] })
          ] })
        ] }),
        healthData.memoryUsage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "health-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Memory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-value", children: [
            healthData.memoryUsage.percentage.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-detail", children: [
            healthData.memoryUsage.used.toFixed(1),
            "MB / ",
            healthData.memoryUsage.total.toFixed(1),
            "MB"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "services-grid", children: healthData.services.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "service-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "service-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: service.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: service.status, children: service.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "service-metrics", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-label", children: "Response Time:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "metric-value", children: [
              service.responseTime.toFixed(1),
              "ms"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-label", children: "Last Check:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-value", children: formatTimestamp(service.lastCheck) })
          ] })
        ] }),
        service.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "service-error", children: [
          "❌ ",
          service.error
        ] }),
        service.details && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "service-details", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: JSON.stringify(service.details, null, 2) })
        ] })
      ] }, service.name)) })
    ] }),
    selectedTab === "errors" && errorData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "errors-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "errors-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "errors-summary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Error Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-stats", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Total:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: errorData.summary.total })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Last 24h:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: errorData.summary.last24Hours })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearErrors, className: "clear-errors-btn", children: "🗑️ Clear All" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-type-summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "type-breakdown", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "By Type" }),
          Object.entries(errorData.summary.byType).map(([type, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "type-count", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "type-name", children: [
              type,
              ":"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "type-value", children: count })
          ] }, type))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "severity-breakdown", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "By Severity" }),
          Object.entries(errorData.summary.bySeverity).map(([severity, count]) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "severity-count", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(StatusBadge, { status: severity === "critical" || severity === "high" ? "critical" : severity === "medium" ? "warning" : "healthy", children: [
            severity,
            ": ",
            count
          ] }) }, severity))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "errors-list", children: errorData.errors.map((error2, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: error2.severity === "critical" || error2.severity === "high" ? "critical" : error2.severity === "medium" ? "warning" : "healthy", children: error2.severity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "error-type", children: error2.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "error-timestamp", children: formatTimestamp(error2.timestamp) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-message", children: error2.message }),
        error2.url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-url", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "error-label", children: "URL:" }),
          " ",
          error2.url
        ] }),
        error2.context && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "error-context", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Context" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: JSON.stringify(error2.context, null, 2) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "error-stack", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Stack Trace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: error2.stackTrace })
        ] })
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .monitoring-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #1f2937;
        }

        .dashboard-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .auto-refresh-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .refresh-btn:hover {
          background: #2563eb;
        }

        .dashboard-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .dashboard-loading {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          position: relative;
        }

        .tab-btn.active {
          border-bottom-color: #3b82f6;
          color: #3b82f6;
        }

        .error-count {
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          margin-left: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-healthy {
          background: #d1fae5;
          color: #065f46;
        }

        .status-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .status-critical {
          background: #fee2e2;
          color: #991b1b;
        }

        .health-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .health-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .health-card h3 {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .metric-detail {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .error-rate {
          color: #dc2626;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .service-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .service-header h4 {
          margin: 0;
          text-transform: capitalize;
        }

        .service-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
        }

        .metric-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .service-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.5rem;
          border-radius: 4px;
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .service-details {
          margin-top: 1rem;
        }

        .service-details pre {
          background: #f9fafb;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          overflow-x: auto;
        }

        .errors-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .errors-summary h3 {
          margin: 0 0 0.5rem 0;
        }

        .summary-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .clear-errors-btn {
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .clear-errors-btn:hover {
          background: #b91c1c;
        }

        .error-type-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .type-breakdown h4,
        .severity-breakdown h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .type-count,
        .severity-count {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .errors-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .error-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
        }

        .error-header {
          margin-bottom: 0.5rem;
        }

        .error-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .error-type {
          font-weight: 600;
          color: #374151;
        }

        .error-timestamp {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .error-message {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .error-url {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .error-label {
          font-weight: 500;
        }

        .error-context,
        .error-stack {
          margin-top: 0.5rem;
        }

        .error-context pre,
        .error-stack pre {
          background: #f9fafb;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
      ` })
  ] });
};

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Panel Administracyjny | MyBonzo", "data-astro-cid-x6qnsptu": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "RandomPolishFonts", $$RandomPolishFonts, { "data-astro-cid-x6qnsptu": true })} ${renderComponent($$result2, "PolishAdminStyles", $$PolishAdminStyles, { "data-astro-cid-x6qnsptu": true })} ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-x6qnsptu": true })}  ${maybeRenderHead()}<div class="workers-vertical-line-left" data-astro-cid-x6qnsptu></div> <div class="workers-vertical-line-right" data-astro-cid-x6qnsptu></div> <main class="min-h-svh" data-astro-cid-x6qnsptu> <!-- Header Section --> <section class="border border-edge relative" data-astro-cid-x6qnsptu> <div class="absolute left-0 right-0 h-full" data-astro-cid-x6qnsptu> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-x6qnsptu> <div class="py-1" data-astro-cid-x6qnsptu></div> </div> </section> <!-- Admin Panel Main Section --> <section class="py-16 border-b border-edge relative" id="admin-panel" data-astro-cid-x6qnsptu> <div class="absolute left-0 right-0 h-full" data-astro-cid-x6qnsptu> <!-- Section vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> </div> <div class="max-w-6xl mx-auto px-4 relative" data-astro-cid-x6qnsptu> <!-- Section Header --> <div class="text-center mb-12" data-astro-cid-x6qnsptu> <div class="flex items-center justify-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-x6qnsptu></path> </svg> <h2 class="text-4xl font-bold text-primary" data-astro-cid-x6qnsptu>
PANEL ADMINISTRACYJNY
</h2> </div> <div class="w-24 h-1 bg-accent mx-auto mb-6" data-astro-cid-x6qnsptu></div> <p class="text-lg text-secondary max-w-2xl mx-auto" data-astro-cid-x6qnsptu>
Zaawansowany panel kontrolny do zarzÄ…dzania systemem AI Workers Platform
</p> </div> <!-- Admin Dashboard Component --> <div class="grid grid-cols-1 gap-8" data-astro-cid-x6qnsptu> <!-- Authentication & Main Dashboard --> <div class="bg-background border border-edge p-6 shadow-lg" data-astro-cid-x6qnsptu> ${renderComponent($$result2, "AdminDashboard", AdminDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/admin/AdminDashboard.tsx", "client:component-export": "default", "data-astro-cid-x6qnsptu": true })} </div> </div> </div> </section> <!-- System Monitoring Section --> <section class="py-16 border-b border-edge relative" id="monitoring" data-astro-cid-x6qnsptu> <div class="absolute left-0 right-0 h-full" data-astro-cid-x6qnsptu> <!-- Section vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> </div> <div class="max-w-6xl mx-auto px-4 relative" data-astro-cid-x6qnsptu> <!-- Section Header --> <div class="text-center mb-12" data-astro-cid-x6qnsptu> <div class="flex items-center justify-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-x6qnsptu></path> </svg> <h2 class="text-4xl font-bold text-primary" data-astro-cid-x6qnsptu>
MONITOROWANIE SYSTEMU
</h2> </div> <div class="w-24 h-1 bg-accent mx-auto mb-6" data-astro-cid-x6qnsptu></div> <p class="text-lg text-secondary max-w-2xl mx-auto" data-astro-cid-x6qnsptu>
Ĺšledzenie wydajnoĹ›ci, bĹ‚Ä™dĂłw i zdrowia systemu w czasie rzeczywistym
</p> </div> <!-- Monitoring Dashboard Component --> <div class="bg-background border border-edge p-6 shadow-lg" data-astro-cid-x6qnsptu> ${renderComponent($$result2, "MonitoringDashboard", MonitoringDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MonitoringDashboard.tsx", "client:component-export": "default", "data-astro-cid-x6qnsptu": true })} </div> </div> </section> <!-- Quick Stats Section --> <section class="py-16 border-b border-edge relative" id="quick-stats" data-astro-cid-x6qnsptu> <div class="absolute left-0 right-0 h-full" data-astro-cid-x6qnsptu> <!-- Section vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> </div> <div class="max-w-6xl mx-auto px-4 relative" data-astro-cid-x6qnsptu> <!-- Section Header --> <div class="text-center mb-12" data-astro-cid-x6qnsptu> <div class="flex items-center justify-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-astro-cid-x6qnsptu></path> </svg> <h2 class="text-4xl font-bold text-primary" data-astro-cid-x6qnsptu>
SZYBKIE STATYSTYKI
</h2> </div> <div class="w-24 h-1 bg-accent mx-auto mb-6" data-astro-cid-x6qnsptu></div> <p class="text-lg text-secondary max-w-2xl mx-auto" data-astro-cid-x6qnsptu>
Kluczowe metryki systemu w przejrzystym formacie
</p> </div> <!-- Quick Stats Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-astro-cid-x6qnsptu> <!-- System Uptime --> <div class="bg-background border border-edge p-6 text-center group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <svg class="w-12 h-12 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <circle cx="12" cy="12" r="10" data-astro-cid-x6qnsptu></circle> <polyline points="12,6 12,12 16,14" data-astro-cid-x6qnsptu></polyline> </svg> <h3 class="text-lg font-semibold text-primary mb-2" data-astro-cid-x6qnsptu>Uptime Systemu</h3> <div id="uptime-display" class="text-2xl font-bold text-accent" data-astro-cid-x6qnsptu>--:--:--</div> <p class="text-sm text-secondary mt-2" data-astro-cid-x6qnsptu>dni:godziny:minuty</p> </div> <!-- Active Workers --> <div class="bg-background border border-edge p-6 text-center group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <svg class="w-12 h-12 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <rect x="4" y="4" width="16" height="16" rx="2" ry="2" data-astro-cid-x6qnsptu></rect> <rect x="9" y="9" width="6" height="6" data-astro-cid-x6qnsptu></rect> <line x1="9" y1="1" x2="9" y2="4" data-astro-cid-x6qnsptu></line> <line x1="15" y1="1" x2="15" y2="4" data-astro-cid-x6qnsptu></line> <line x1="9" y1="20" x2="9" y2="23" data-astro-cid-x6qnsptu></line> <line x1="15" y1="20" x2="15" y2="23" data-astro-cid-x6qnsptu></line> <line x1="20" y1="9" x2="23" y2="9" data-astro-cid-x6qnsptu></line> <line x1="1" y1="9" x2="4" y2="9" data-astro-cid-x6qnsptu></line> <line x1="20" y1="15" x2="23" y2="15" data-astro-cid-x6qnsptu></line> <line x1="1" y1="15" x2="4" y2="15" data-astro-cid-x6qnsptu></line> </svg> <h3 class="text-lg font-semibold text-primary mb-2" data-astro-cid-x6qnsptu>Active Workers</h3> <div id="workers-count" class="text-2xl font-bold text-accent" data-astro-cid-x6qnsptu>0</div> <p class="text-sm text-secondary mt-2" data-astro-cid-x6qnsptu>z 10 dostÄ™pnych</p> </div> <!-- API Requests --> <div class="bg-background border border-edge p-6 text-center group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <svg class="w-12 h-12 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" data-astro-cid-x6qnsptu></polygon> </svg> <h3 class="text-lg font-semibold text-primary mb-2" data-astro-cid-x6qnsptu>API Requests</h3> <div id="api-requests" class="text-2xl font-bold text-accent" data-astro-cid-x6qnsptu>0</div> <p class="text-sm text-secondary mt-2" data-astro-cid-x6qnsptu>ostatnie 24h</p> </div> <!-- Error Rate --> <div class="bg-background border border-edge p-6 text-center group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <svg class="w-12 h-12 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" data-astro-cid-x6qnsptu></path> <line x1="12" y1="9" x2="12" y2="13" data-astro-cid-x6qnsptu></line> <line x1="12" y1="17" x2="12.01" y2="17" data-astro-cid-x6qnsptu></line> </svg> <h3 class="text-lg font-semibold text-primary mb-2" data-astro-cid-x6qnsptu>Error Rate</h3> <div id="error-rate" class="text-2xl font-bold text-accent" data-astro-cid-x6qnsptu>0%</div> <p class="text-sm text-secondary mt-2" data-astro-cid-x6qnsptu>ostatnie 24h</p> </div> </div> </div> </section> <!-- Admin Tools Section --> <section class="py-16 border-b border-edge relative" id="admin-tools" data-astro-cid-x6qnsptu> <div class="absolute left-0 right-0 h-full" data-astro-cid-x6qnsptu> <!-- Section vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-x6qnsptu></div> </div> <div class="max-w-6xl mx-auto px-4 relative" data-astro-cid-x6qnsptu> <!-- Section Header --> <div class="text-center mb-12" data-astro-cid-x6qnsptu> <div class="flex items-center justify-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" data-astro-cid-x6qnsptu></path> </svg> <h2 class="text-4xl font-bold text-primary" data-astro-cid-x6qnsptu>
NARZÄDZIA ADMINISTRACYJNE
</h2> </div> <div class="w-24 h-1 bg-accent mx-auto mb-6" data-astro-cid-x6qnsptu></div> <p class="text-lg text-secondary max-w-2xl mx-auto" data-astro-cid-x6qnsptu>
ZbiĂłr narzÄ™dzi do zarzÄ…dzania i diagnostyki systemu
</p> </div> <!-- Tools Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-x6qnsptu> <!-- System Health Check --> <div class="bg-background border border-edge p-6 group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <div class="flex items-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path d="M22 12h-4l-3 9L9 3l-3 9H2" data-astro-cid-x6qnsptu></path> </svg> <h3 class="text-xl font-semibold text-primary" data-astro-cid-x6qnsptu>Health Check</h3> </div> <p class="text-secondary mb-4" data-astro-cid-x6qnsptu>SprawdĹş stan zdrowia wszystkich komponentĂłw systemu</p> <button id="health-check-btn" class="w-full bg-accent text-background hover:bg-accent/90 px-4 py-2 transition-colors font-semibold" data-astro-cid-x6qnsptu>
Uruchom sprawdzenie
</button> <div id="health-result" class="mt-4 text-sm" data-astro-cid-x6qnsptu></div> </div> <!-- Clear Cache --> <div class="bg-background border border-edge p-6 group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <div class="flex items-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <polyline points="3,6 5,6 21,6" data-astro-cid-x6qnsptu></polyline> <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" data-astro-cid-x6qnsptu></path> <line x1="10" y1="11" x2="10" y2="17" data-astro-cid-x6qnsptu></line> <line x1="14" y1="11" x2="14" y2="17" data-astro-cid-x6qnsptu></line> </svg> <h3 class="text-xl font-semibold text-primary" data-astro-cid-x6qnsptu>WyczyĹ›Ä‡ Cache</h3> </div> <p class="text-secondary mb-4" data-astro-cid-x6qnsptu>UsuĹ„ cache systemu i wymuĹ› odĹ›wieĹĽenie</p> <button id="clear-cache-btn" class="w-full bg-accent text-background hover:bg-accent/90 px-4 py-2 transition-colors font-semibold" data-astro-cid-x6qnsptu>
WyczyĹ›Ä‡ cache
</button> <div id="cache-result" class="mt-4 text-sm" data-astro-cid-x6qnsptu></div> </div> <!-- Performance Metrics --> <div class="bg-background border border-edge p-6 group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <div class="flex items-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-astro-cid-x6qnsptu></path> </svg> <h3 class="text-xl font-semibold text-primary" data-astro-cid-x6qnsptu>Metryki wydajnoĹ›ci</h3> </div> <p class="text-secondary mb-4" data-astro-cid-x6qnsptu>Analiza wydajnoĹ›ci i czasĂłw odpowiedzi</p> <button id="performance-btn" class="w-full bg-accent text-background hover:bg-accent/90 px-4 py-2 transition-colors font-semibold" data-astro-cid-x6qnsptu>
Generuj raport
</button> <div id="performance-result" class="mt-4 text-sm" data-astro-cid-x6qnsptu></div> </div> <!-- Log Viewer --> <div class="bg-background border border-edge p-6 group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <div class="flex items-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-x6qnsptu></path> <polyline points="14,2 14,8 20,8" data-astro-cid-x6qnsptu></polyline> <line x1="16" y1="13" x2="8" y2="13" data-astro-cid-x6qnsptu></line> <line x1="16" y1="17" x2="8" y2="17" data-astro-cid-x6qnsptu></line> <polyline points="10,9 9,9 8,9" data-astro-cid-x6qnsptu></polyline> </svg> <h3 class="text-xl font-semibold text-primary" data-astro-cid-x6qnsptu>PodglÄ…d logĂłw</h3> </div> <p class="text-secondary mb-4" data-astro-cid-x6qnsptu>PrzeglÄ…daj logi systemowe i bĹ‚Ä™dy</p> <button id="logs-btn" class="w-full bg-accent text-background hover:bg-accent/90 px-4 py-2 transition-colors font-semibold" data-astro-cid-x6qnsptu>
PokaĹĽ logi
</button> <div id="logs-result" class="mt-4 text-sm" data-astro-cid-x6qnsptu></div> </div> <!-- Database Management --> <div class="bg-background border border-edge p-6 group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <div class="flex items-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <ellipse cx="12" cy="5" rx="9" ry="3" data-astro-cid-x6qnsptu></ellipse> <path d="m21 12c0 1.66-4 3-9 3s-9-1.34-9-3" data-astro-cid-x6qnsptu></path> <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" data-astro-cid-x6qnsptu></path> </svg> <h3 class="text-xl font-semibold text-primary" data-astro-cid-x6qnsptu>ZarzÄ…dzanie bazÄ…</h3> </div> <p class="text-secondary mb-4" data-astro-cid-x6qnsptu>Operacje na bazie danych i storage</p> <button id="database-btn" class="w-full bg-accent text-background hover:bg-accent/90 px-4 py-2 transition-colors font-semibold" data-astro-cid-x6qnsptu>
OtwĂłrz panel
</button> <div id="database-result" class="mt-4 text-sm" data-astro-cid-x6qnsptu></div> </div> <!-- Backup & Restore --> <div class="bg-background border border-edge p-6 group hover:border-accent transition-colors" data-astro-cid-x6qnsptu> <div class="flex items-center mb-4" data-astro-cid-x6qnsptu> <svg class="w-8 h-8 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-x6qnsptu> <line x1="22" y1="12" x2="2" y2="12" data-astro-cid-x6qnsptu></line> <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" data-astro-cid-x6qnsptu></path> <line x1="6" y1="16" x2="6.01" y2="16" data-astro-cid-x6qnsptu></line> <line x1="10" y1="16" x2="10.01" y2="16" data-astro-cid-x6qnsptu></line> </svg> <h3 class="text-xl font-semibold text-primary" data-astro-cid-x6qnsptu>Backup & Restore</h3> </div> <p class="text-secondary mb-4" data-astro-cid-x6qnsptu>Tworzenie kopii zapasowych i przywracanie</p> <button id="backup-btn" class="w-full bg-accent text-background hover:bg-accent/90 px-4 py-2 transition-colors font-semibold" data-astro-cid-x6qnsptu>
UtwĂłrz backup
</button> <div id="backup-result" class="mt-4 text-sm" data-astro-cid-x6qnsptu></div> </div> </div> </div> </section> </main> ` })} ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/dashboard.astro?astro&type=script&index=0&lang.ts")} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/dashboard.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/admin/dashboard.astro";
const $$url = "/admin/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    url: $$url
=======
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, b as renderScript, m as maybeRenderHead } from '../../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$UniversalPageLayout, a as $$GlassPanel, b as $$CyberpunkButton } from '../../chunks/CyberpunkButton_BsyRwZt1.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Dashboard Administracyjny | MyBonzo";
  const pageDescription = "Kompletny panel zarz\u0105dzania systemem MyBonzo AI z real-time monitoring";
  const pageQuote = "Pe\u0142na kontrola nad infrastruktur\u0105 Cloudflare";
  const pageAuthor = "MyBonzo Team";
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F9ED} Zarz\u0105dzanie systemem", "variant": "info", "padding": "sm" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F3E0} Admin Home", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/'" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F465} U\u017Cytkownicy", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/users'" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4CA} Monitoring", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/monitoring'" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F916} AI Chat", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/ai-chat'" })} </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u2601\uFE0F Cloudflare - Statystyki w czasie rzeczywistym", "variant": "highlight", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 25px;"> <div style="background: rgba(255,165,0,0.1); padding: 15px; border: 1px solid rgba(255,165,0,0.4); border-radius: 8px; text-align: center;"> <div style="color: #ffa500; font-size: 1.8rem; font-weight: 700;" id="r2Storage">-- GB</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">R2 Storage</div> </div> <div style="background: rgba(34,197,94,0.1); padding: 15px; border: 1px solid rgba(34,197,94,0.4); border-radius: 8px; text-align: center;"> <div style="color: #22c55e; font-size: 1.8rem; font-weight: 700;" id="kvCalls">--</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">KV Calls</div> </div> <div style="background: rgba(168,85,247,0.1); padding: 15px; border: 1px solid rgba(168,85,247,0.4); border-radius: 8px; text-align: center;"> <div style="color: #a855f7; font-size: 1.8rem; font-weight: 700;" id="aiCalls">--</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">AI Calls</div> </div> <div style="background: rgba(239,68,68,0.1); padding: 15px; border: 1px solid rgba(239,68,68,0.4); border-radius: 8px; text-align: center;"> <div style="color: #ef4444; font-size: 1.8rem; font-weight: 700;" id="errorRate">--%</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">Error Rate</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.4); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 1.8rem; font-weight: 700;" id="bandwidth">-- GB</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">Bandwidth</div> </div> <div style="background: rgba(236,72,153,0.1); padding: 15px; border: 1px solid rgba(236,72,153,0.4); border-radius: 8px; text-align: center;"> <div style="color: #ec4899; font-size: 1.8rem; font-weight: 700;" id="avgResponse">-- ms</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">Avg Response</div> </div> </div> <div style="text-align: center; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F504} Od\u015Bwie\u017C statystyki", "variant": "primary", "size": "md", "onclick": "refreshAllStats()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4C8} Cloudflare Dashboard", "variant": "outline", "size": "md", "onclick": "window.open('https://dash.cloudflare.com/analytics', '_blank')" })} </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F916} Zarz\u0105dzanie Cloudflare Workers", "variant": "success", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div id="workersPanel"> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px;" id="workersGrid"> <!-- Workers will be loaded here --> </div> </div> <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F504} Od\u015Bwie\u017C workers", "variant": "primary", "size": "md", "onclick": "loadWorkers()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u2795 Nowy worker", "variant": "success", "size": "md", "onclick": "showCreateWorkerDialog()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F6E0}\uFE0F Wrangler CLI", "variant": "outline", "size": "md", "onclick": "openWranglerConsole()" })} </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F310} Zarz\u0105dzanie stron\u0105", "variant": "default", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;"> <!-- Cache Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px;">🗄️ Zarządzanie cache</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Wyczyść cache, ustaw TTL, zarządzaj regułami
</p> <div style="display: flex; gap: 8px; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F9F9} Purge Cache", "variant": "warning", "size": "sm", "onclick": "purgeCache()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u2699\uFE0F Cache Rules", "variant": "outline", "size": "sm", "onclick": "manageCacheRules()" })} </div> </div> <!-- R2 Storage Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px;">📦 R2 Storage</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj buckets R2, pliki i użycie storage
</p> <div style="display: flex; gap: 8px; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4E6} Buckets", "variant": "outline", "size": "sm", "onclick": "window.open('https://dash.cloudflare.com/r2', '_blank')" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4CA} Usage", "variant": "outline", "size": "sm", "onclick": "showR2Usage()" })} </div> </div> <!-- DNS Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px;">🌍 DNS & Domeny</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj rekordami DNS i domenami
</p> <div style="display: flex; gap: 8px; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F517} DNS Records", "variant": "outline", "size": "sm", "onclick": "manageDNS()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4E1} Proxy Status", "variant": "outline", "size": "sm", "onclick": "checkProxyStatus()" })} </div> </div> <!-- Security Settings --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px;">🔒 Bezpieczeństwo</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
WAF, SSL, DDoS protection, API tokens
</p> <div style="display: flex; gap: 8px; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F6E1}\uFE0F WAF Rules", "variant": "outline", "size": "sm", "onclick": "manageWAF()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F510} SSL/TLS", "variant": "outline", "size": "sm", "onclick": "manageSSL()" })} </div> </div> </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u26A1 Szybkie akcje", "variant": "warning", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F680} Deploy Site", "variant": "success", "size": "lg", "onclick": "deploySite()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4DD} View Logs", "variant": "info", "size": "lg", "onclick": "viewLogs()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F527} Worker Editor", "variant": "primary", "size": "lg", "onclick": "openWorkerEditor()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4CA} Analytics", "variant": "outline", "size": "lg", "onclick": "window.open('https://dash.cloudflare.com/analytics', '_blank')" })} </div> ` })} ${renderScript($$result2, "Q:/mybonzo/mybonzo-github/src/pages/admin/dashboard.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/admin/dashboard.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/admin/dashboard.astro";
const $$url = "/admin/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
