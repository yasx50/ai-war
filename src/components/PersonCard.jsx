import "./PersonCard.css";

export default function PersonCard({ person, isActive = false }) {
  return (
    <div className={`personCard ${isActive ? "active" : ""}`}>
      <div className="photoContainer">
        {person.photoPreview ? (
          <img src={person.photoPreview} alt={person.name} className="personPhoto" />
        ) : (
          <div className="photoPlaceholder">
            <span className="photoInitial">{person.name.charAt(0)}</span>
          </div>
        )}
        {isActive && <div className="activeBadge">Active</div>}
      </div>
      
      <div className="personInfo">
        <h3 className="personName">{person.name}</h3>
        <p className="personContext">{person.context}</p>
      </div>
    </div>
  );
}
