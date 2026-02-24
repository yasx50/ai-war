import { useState } from "react";
import PersonSetup from "./components/PersonSetup";
import PersonCard from "./components/PersonCard";
import { RotateCcw, Settings } from "lucide-react";
import "./App.css";

export default function App() {
  const [persons, setPersons] = useState(null);
  const [language, setLanguage] = useState("hindi");
  const [topic, setTopic] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const API = "http://localhost:5000";

  const handleSetupComplete = (setupPersons, selectedLanguage) => {
    setPersons(setupPersons);
    setLanguage(selectedLanguage);
  };

  const startDebate = async () => {
    if (!topic.trim()) return alert("Topic enter kar bhai!");

    setLoading(true);
    setChats([]);
    setStarted(true);

    try {
      const res = await fetch(`${API}/debate-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1: {
            name: persons[0].name,
            context: persons[0].context,
            preferences: persons[0].preferences,
          },
          person2: {
            name: persons[1].name,
            context: persons[1].context,
            preferences: persons[1].preferences,
          },
          language: language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      console.log("✅ Debate started successfully");
    } catch (error) {
      console.error("❌ Error starting debate:", error);
      alert(`Server error: ${error.message}`);
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const nextTurn = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/debate-turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          person1Name: persons[0].name,
          person2Name: persons[1].name,
          language: language,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.logs && data.logs.length >= 2) {
        setChats(prev => [...prev, { ...data.logs[0], photo: persons[0].photoPreview }]);
        setTimeout(() => {
          setChats(prev => [...prev, { ...data.logs[1], photo: persons[1].photoPreview }]);
        }, 800);
      } else {
        console.error("Unexpected response format:", data);
        alert("Error: Could not get AI response");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
        <h1 className="title">⚔️ AI LAFDA ARENA</h1>
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
            placeholder="Debate ka topic likho... (e.g., Chai vs Coffee, Android vs iPhone)"
            className="topicInput"
          />
          <button onClick={startDebate} className="startBtn">
            🔥 Start Battle
          </button>
        </div>
      )}

      {/* Chat Section */}
      <div className="chatContainer">
        {chats.length === 0 && started && (
          <div className="debateStart">
            <p className="topic">🎯 Topic: <strong>{topic}</strong></p>
            <p className="instruction">Tap "Next Turn" to shuru karo lafda...</p>
          </div>
        )}

        {chats.map((msg, i) => {
          const isPlayer1 = msg.personName === persons[0].name;
          return (
            <div
              key={i}
              className={`chatRow ${isPlayer1 ? "left" : "right"}`}
            >
              {/* Speaker Photo */}
              <div className="speakerPhoto">
                {msg.photo ? (
                  <img src={msg.photo} alt={msg.personName} />
                ) : (
                  <div className="photoPlaceholder">{msg.personName.charAt(0)}</div>
                )}
              </div>

              {/* Chat Bubble */}
              <div className={`chatBubble ${isPlayer1 ? "player1" : "player2"}`}>
                <span className="speakerName">{msg.personName}</span>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

        {loading && <div className="typing">🤔 Soch raha hai...</div>}
      </div>

      {/* Controls */}
      {started && (
        <div className="controlsSection">
          <button
            className="nextBtn"
            onClick={nextTurn}
            disabled={loading}
          >
            {loading ? "⏳ Soch rahe..." : "⚡ Next Turn"}
          </button>
          <button className="newDebateBtn" onClick={resetSetup}>
            <RotateCcw size={18} />
            Nya Lafda
          </button>
        </div>
      )}

      <p className="footer">Pure Hindi/Marathi/English mein lafda. Gaaliyan allowed! 🔥</p>
    </div>
  );
}
