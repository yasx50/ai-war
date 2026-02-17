import { useState } from "react";
import PersonSetup from "./components/PersonSetup";
import PersonCard from "./components/PersonCard";
import { RotateCcw, Settings } from "lucide-react";
import "./App.css";

export default function App() {
  const [persons, setPersons] = useState(null);
  const [topic, setTopic] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const API = "http://localhost:5000";

  const handleSetupComplete = (setupPersons) => {
    setPersons(setupPersons);
  };

  const startDebate = async () => {
    if (!topic.trim()) return alert("Enter topic");

    setLoading(true);
    setChats([]);
    setStarted(true);

    await fetch(`${API}/debate-start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        person1: {
          name: persons[0].name,
          context: persons[0].context,
        },
        person2: {
          name: persons[1].name,
          context: persons[1].context,
        },
      }),
    });

    setLoading(false);
  };

  const nextTurn = async () => {
    setLoading(true);

    const res = await fetch(`${API}/debate-turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        person1Name: persons[0].name,
        person2Name: persons[1].name,
      }),
    });

    const data = await res.json();
    setChats(prev => [...prev, data.logs[0]]);
    setTimeout(() => {
      setChats(prev => [...prev, data.logs[1]]);
    }, 800);

    setLoading(false);
  };

  const resetSetup = () => {
    setPersons(null);
    setTopic("");
    setChats([]);
    setStarted(false);
  };

  // Setup Phase
  if (!persons) {
    return <PersonSetup onSetupComplete={handleSetupComplete} />;
  }

  // Debate Phase
  return (
    <div className="debateContainer">
      <div className="header">
        <h1 className="title">⚔️ AI War Arena</h1>
        <button className="resetBtn" onClick={resetSetup} title="Setup new persons">
          <Settings size={20} />
        </button>
      </div>

      {/* Person Cards */}
      <div className="personCardsSection">
        <PersonCard person={persons[0]} isActive={started} />
        <div className="versus">VS</div>
        <PersonCard person={persons[1]} isActive={started} />
      </div>

      {/* Input Section */}
      {!started && (
        <div className="inputBox">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the debate topic..."
            className="topicInput"
          />
          <button onClick={startDebate} className="startBtn">
            ⚡ Start Battle
          </button>
        </div>
      )}

      {/* Chat Section */}
      <div className="chatContainer">
        {chats.length === 0 && started && (
          <div className="debateStart">
            <p className="topic">Topic: <strong>{topic}</strong></p>
            <p className="instruction">Tap "Next Turn" to begin the debate...</p>
          </div>
        )}

        {chats.map((msg, i) => {
          const isPlayer1 = msg.personName === persons[0].name;
          return (
            <div
              key={i}
              className={`chatRow ${isPlayer1 ? "left" : "right"}`}
            >
              <div className={`chatBubble ${isPlayer1 ? "player1" : "player2"}`}>
                <span className="speakerName">{msg.personName}</span>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

        {loading && <div className="typing">🤔 AI Thinking...</div>}
      </div>

      {/* Controls */}
      {started && (
        <div className="controlsSection">
          <button
            className="nextBtn"
            onClick={nextTurn}
            disabled={loading}
          >
            {loading ? "⏳ Thinking..." : "⚡ Next Turn"}
          </button>
          <button className="newDebateBtn" onClick={resetSetup}>
            <RotateCcw size={18} />
            New Debate
          </button>
        </div>
      )}

      <p className="footer">Two people. Two AI minds. One debate arena.</p>
    </div>
  );
}
