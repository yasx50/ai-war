import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import "./PersonSetup.css";

export default function PersonSetup({ onSetupComplete }) {
  const [persons, setPersons] = useState([
    { id: 1, name: "", context: "", photo: null, photoPreview: null },
    { id: 2, name: "", context: "", photo: null, photoPreview: null }
  ]);
  const [language, setLanguage] = useState("hindi");

  const handlePersonChange = (id, field, value) => {
    setPersons(persons.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handlePhotoChange = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersons(persons.map(p =>
          p.id === id
            ? { ...p, photo: file, photoPreview: e.target.result }
            : p
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const parsePreferences = (context) => {
    const loveMatch = context.match(/love.*?([\w\s,]+?)(?:hate|dislikes?|and|$)/i);
    const hateMatch = context.match(/hate.*?([\w\s,]+?)(?:love|and|$)/i);
    const dislikesMatch = context.match(/dislikes?.*?([\w\s,]+?)(?:love|hate|and|$)/i);

    return {
      loves: loveMatch ? loveMatch[1].trim() : "",
      hates: hateMatch ? hateMatch[1].trim() : "",
      dislikes: dislikesMatch ? dislikesMatch[1].trim() : ""
    };
  };

  const handleSubmit = () => {
    const allFilled = persons.every(p => p.name.trim() && p.context.trim());
    if (!allFilled) {
      alert("Name aur context dono fill kar!");
      return;
    }

    const enrichedPersons = persons.map(p => ({
      ...p,
      preferences: parsePreferences(p.context)
    }));

    onSetupComplete(enrichedPersons, language);
  };

  return (
    <div className="setupContainer">
      <div className="setupCard">
        <h1 className="setupTitle">⚙️ AI Arena Setup</h1>
        <p className="setupSubtitle">Do AI ko personality do - love, hate, sab battle</p>

        {/* Language Selection */}
        <div className="languageSelector">
          <label>🌐 Debate Language:</label>
          <div className="languageButtons">
            <button
              className={`langBtn ${language === "hindi" ? "active" : ""}`}
              onClick={() => setLanguage("hindi")}
            >
              हिंदी Hindi
            </button>
            <button
              className={`langBtn ${language === "marathi" ? "active" : ""}`}
              onClick={() => setLanguage("marathi")}
            >
              मराठी Marathi
            </button>
            <button
              className={`langBtn ${language === "english" ? "active" : ""}`}
              onClick={() => setLanguage("english")}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <div className="personsGrid">
          {persons.map((person, idx) => (
            <div key={person.id} className="personForm">
              <div className="personNumber">Person {idx + 1}</div>

              {/* Photo Upload */}
              <div className="photoUploadSection">
                {person.photoPreview ? (
                  <div className="photoPreview">
                    <img src={person.photoPreview} alt={person.name} />
                    <button
                      type="button"
                      className="removePhotoBtn"
                      onClick={() => handlePhotoChange(person.id, null)}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="photoLabel">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(person.id, e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <div className="photoPlaceholder">
                      <Upload size={24} />
                      <span>Photo Upload</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Name Input */}
              <input
                type="text"
                placeholder={`Person ${idx + 1} Name`}
                value={person.name}
                onChange={(e) => handlePersonChange(person.id, "name", e.target.value)}
                className="inputField"
              />

              {/* Context Input */}
              <textarea
                placeholder={`Personality describe kar...\nExample: I love coding, hate meetings, love coffee. I am introvert.`}
                value={person.context}
                onChange={(e) => handlePersonChange(person.id, "context", e.target.value)}
                className="contextField"
                rows="6"
              />

              {/* Auto-extracted preferences */}
              {person.context && (
                <div className="preferencesPreview">
                  {parsePreferences(person.context).loves && (
                    <div className="pref-item love">
                      <span>❤️ Love:</span> {parsePreferences(person.context).loves}
                    </div>
                  )}
                  {parsePreferences(person.context).hates && (
                    <div className="pref-item hate">
                      <span>😤 Hate:</span> {parsePreferences(person.context).hates}
                    </div>
                  )}
                  {parsePreferences(person.context).dislikes && (
                    <div className="pref-item dislike">
                      <span>😒 Dislike:</span> {parsePreferences(person.context).dislikes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="startBtn" onClick={handleSubmit}>
          <Plus size={20} />
          Start Lafda
        </button>
      </div>
    </div>
  );
}
