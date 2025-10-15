import React, { useState, useEffect } from "react";

interface User {
  id: string | number;
  username: string;
  role: string;
}

interface UsersApiResponse {
  users: User[];
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json() as UsersApiResponse;
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
    return <div style={cardStyle}>Loading users...</div>;
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
        👥 USER MANAGEMENT
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #333",
                padding: "8px",
                textAlign: "left",
              }}
            >
              ID
            </th>
            <th
              style={{
                border: "1px solid #333",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Username
            </th>
            <th
              style={{
                border: "1px solid #333",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Role
            </th>
            <th
              style={{
                border: "1px solid #333",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid #333", padding: "8px" }}>
                {user.id}
              </td>
              <td style={{ border: "1px solid #333", padding: "8px" }}>
                {user.username}
              </td>
              <td style={{ border: "1px solid #333", padding: "8px" }}>
                {user.role}
              </td>
              <td style={{ border: "1px solid #333", padding: "8px" }}>
                <button style={{ marginRight: "5px" }}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
