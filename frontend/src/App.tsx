import { useEffect, useState } from "react";

interface Status {
  id: number;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: number;
}

const API_URL = "http://localhost:5000";

function App() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("low");

  //get implementation
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch(`${API_URL}/statuses`);
        const data = await response.json();
        setStatuses(data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // post implementation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return alert("Missing required fields");

    const newStatus = { title, message, severity };

    try {
      const response = await fetch(`${API_URL}/statuses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });

      if (response.ok) {
        const createdItem = await response.json();
        // Optimistic UI update: add the new item to the top of the list manually
        // so we don't have to trigger a whole second GET request.
        setStatuses((prev) => [createdItem, ...prev]);

        // Reset form
        setTitle("");
        setMessage("");
        setSeverity("low");
      }
    } catch (error) {
      console.error("Error posting status:", error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#1a1a1a" }}>System Status Dashboard</h1>
        <p style={{ color: "#666" }}>Live updates from the backend</p>
      </header>

      {/* FORM SECTION */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Post Status Update</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <input
              style={{
                width: "100%",
                padding: "12px",
                boxSizing: "border-box",
                borderRadius: "6px",
                border: "1px solid #ddd",
              }}
              placeholder="Service Name (e.g. API Server)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <textarea
              style={{
                width: "100%",
                padding: "12px",
                boxSizing: "border-box",
                borderRadius: "6px",
                border: "1px solid #ddd",
                minHeight: "80px",
              }}
              placeholder="What is the current issue?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <label>Severity:</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="submit"
              style={{
                marginLeft: "auto",
                padding: "10px 25px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Publish Update
            </button>
          </div>
        </form>
      </section>

      {/* FEED SECTION */}
      <section>
        <h2 style={{ fontSize: "1.2rem" }}>Incident Feed</h2>
        {loading ? (
          <p>Connecting to API...</p>
        ) : statuses.length === 0 ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              backgroundColor: "#e6fffa",
              color: "#2c7a7b",
              borderRadius: "8px",
              border: "1px solid #b2f5ea",
            }}
          >
            ✨ All systems operational. No updates reported.
          </div>
        ) : (
          statuses.map((s) => (
            <div
              key={s.id}
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "15px",
                borderLeft: `6px solid ${s.severity === "high" ? "#e53e3e" : s.severity === "medium" ? "#dd6b20" : "#38a169"}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "1.1rem" }}>{s.title}</strong>
                <span style={{ fontSize: "0.8rem", color: "#a0aec0" }}>
                  {new Date(s.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ margin: "10px 0", color: "#4a5568" }}>{s.message}</p>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  color:
                    s.severity === "high"
                      ? "#e53e3e"
                      : s.severity === "medium"
                        ? "#dd6b20"
                        : "#38a169",
                  textTransform: "uppercase",
                }}
              >
                {s.severity} Severity
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
