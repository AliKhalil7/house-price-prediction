import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PredictionRequest } from "../types/prediction";
import { getPrediction } from "../api/predictionClient";

//lists of options for all dropdown fields in the form
const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TRANSACTION_OPTIONS = ["New Property", "Resale"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

// Inline styles for form fields
const fieldWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "16px",
};

// Inline styles for labels and the inputs
const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "14px",
};

// Inline styles for the input fields
const inputStyle: React.CSSProperties = {
  padding: "8px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
};

// The main component for the prediction form
export default function PredictionForm() {
  const navigate = useNavigate();

  //This holds the list of valid locations fetched from locations.json file
  const [locations, setLocations] = useState<string[]>([]);
//This holds the current values of every form field as the user types or selects
  const [form, setForm] = useState<PredictionRequest>({
    location: "",
    carpet_area_sqft: 0,
    floor_num: 0,
    bathroom: 0,
    balcony: 0,
    furnishing: FURNISHING_OPTIONS[0],
    transaction: TRANSACTION_OPTIONS[0],
    ownership: OWNERSHIP_OPTIONS[0],
    facing: FACING_OPTIONS[0],
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
//This runs once when the component loads, to fetch and populate the location dropdown
  useEffect(() => {
    fetch("/locations.json")
      .then((res) => res.json())
      .then((data: string[]) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  function updateField<K extends keyof PredictionRequest>(
    field: K,
    value: PredictionRequest[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
// Checks for invalid values before sending it to the API.
  function validate(): string | null {
    if (!form.location) return "Please select a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0)
      return "Carpet area must be greater than 0.";
    if (form.floor_num < 0) return "Floor number can't be negative.";
    if (form.bathroom < 0) return "Bathroom count can't be negative.";
    if (form.balcony < 0) return "Balcony count can't be negative.";
    return null;
  }
// This runs when the form is submitted ,validates and calls the backend API, and navigates to the result page with the prediction
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await getPrediction(form);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      setError("Something went wrong getting a prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <p style={{ marginBottom: "20px", color: "#555", fontSize: "14px" }}>
        Fill in the property details below and click "Predict price" to get an
        estimated market value based on similar listings.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={fieldWrapperStyle}>
          <label htmlFor="location" style={labelStyle}>Location</label>
          <select
            id="location"
            style={inputStyle}
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="carpet_area_sqft" style={labelStyle}>Carpet area (sqft)</label>
          <input
            id="carpet_area_sqft"
            type="number"
            style={inputStyle}
            value={form.carpet_area_sqft}
            onChange={(e) => updateField("carpet_area_sqft", Number(e.target.value))}
          />
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="floor_num" style={labelStyle}>Floor number</label>
          <input
            id="floor_num"
            type="number"
            style={inputStyle}
            value={form.floor_num}
            onChange={(e) => updateField("floor_num", Number(e.target.value))}
          />
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="bathroom" style={labelStyle}>Bathrooms</label>
          <input
            id="bathroom"
            type="number"
            style={inputStyle}
            value={form.bathroom}
            onChange={(e) => updateField("bathroom", Number(e.target.value))}
          />
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="balcony" style={labelStyle}>Balconies</label>
          <input
            id="balcony"
            type="number"
            style={inputStyle}
            value={form.balcony}
            onChange={(e) => updateField("balcony", Number(e.target.value))}
          />
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="furnishing" style={labelStyle}>Furnishing</label>
          <select
            id="furnishing"
            style={inputStyle}
            value={form.furnishing}
            onChange={(e) => updateField("furnishing", e.target.value)}
          >
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="transaction" style={labelStyle}>Transaction type</label>
          <select
            id="transaction"
            style={inputStyle}
            value={form.transaction}
            onChange={(e) => updateField("transaction", e.target.value)}
          >
            {TRANSACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="ownership" style={labelStyle}>Ownership</label>
          <select
            id="ownership"
            style={inputStyle}
            value={form.ownership}
            onChange={(e) => updateField("ownership", e.target.value)}
          >
            {OWNERSHIP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="facing" style={labelStyle}>Facing</label>
          <select
            id="facing"
            style={inputStyle}
            value={form.facing}
            onChange={(e) => updateField("facing", e.target.value)}
          >
            {FACING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: "10px 20px", fontSize: "14px" }}>
          {loading ? "Getting prediction..." : "Predict price"}
        </button>
      </form>
    </div>
  );
}