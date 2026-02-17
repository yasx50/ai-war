import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import "./PersonSetup.css";

export default function PersonSetup({ onSetupComplete }) {
  const [persons, setPersons] = useState([
    { id: 1, name: "", context: "", photo: null, photoPreview: null },
    { id: 2, name: "", context: "", photo: null, photoPreview: null }
  ]);

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

  const handleSubmit = () => {
    const allFilled = persons.every(p => p.name.trim() && p.context.trim());
    if (!allFilled) {
      alert("Please fill in name and context for both persons");
      return;
    }
    onSetupComplete(persons);
  };

  return (
    <div className="setupContainer">
      <div className="setupCard">
        <h1 className="setupTitle">⚙️ AI Personas Setup</h1>
        <p className="setupSubtitle">Create two unique AI personalities with their own context</p>

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
                      <span>Upload Photo</span>
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
                placeholder={`Add context for ${person.name || `Person ${idx + 1}`}... (e.g., profession, expertise, personality)`}
                value={person.context}
                onChange={(e) => handlePersonChange(person.id, "context", e.target.value)}
                className="contextField"
                rows="6"
              />
            </div>
          ))}
        </div>

        <button className="startBtn" onClick={handleSubmit}>
          <Plus size={20} />
          Start Debate
        </button>
      </div>
    </div>
  );
}
