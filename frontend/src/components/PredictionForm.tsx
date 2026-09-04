import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PredictionRequest } from "../types/prediction";
import { getPrediction } from "../api/predictionClient";

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TRANSACTION_OPTIONS = ["New Property", "Resale"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

export default function PredictionForm() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<string[]>([]);
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

  // Load the list of known locations for the dropdown
  useEffect(() => {
    fetch("/locations.json")
      .then((res) => res.json())
      .then((data: string[]) => setLocations(data))
      .catch(() => setLocations([])); // fine if it fails; user can still type... but we're using a <select>, so fallback to empty
  }, []);

  function updateField<K extends keyof PredictionRequest>(
    field: K,
    value: PredictionRequest[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): string | null {
    if (!form.location) return "Please select a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0)
      return "Carpet area must be greater than 0.";
    if (form.floor_num < 0) return "Floor number can't be negative.";
    if (form.bathroom < 0) return "Bathroom count can't be negative.";
    if (form.balcony < 0) return "Balcony count can't be negative.";
    return null;
  }

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="location">Location</label>
        <select
          id="location"
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

      <div>
        <label htmlFor="carpet_area_sqft">Carpet area (sqft)</label>
        <input
          id="carpet_area_sqft"
          type="number"
          value={form.carpet_area_sqft}
          onChange={(e) => updateField("carpet_area_sqft", Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="floor_num">Floor number</label>
        <input
          id="floor_num"
          type="number"
          value={form.floor_num}
          onChange={(e) => updateField("floor_num", Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="bathroom">Bathrooms</label>
        <input
          id="bathroom"
          type="number"
          value={form.bathroom}
          onChange={(e) => updateField("bathroom", Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="balcony">Balconies</label>
        <input
          id="balcony"
          type="number"
          value={form.balcony}
          onChange={(e) => updateField("balcony", Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="furnishing">Furnishing</label>
        <select
          id="furnishing"
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

      <div>
        <label htmlFor="transaction">Transaction type</label>
        <select
          id="transaction"
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

      <div>
        <label htmlFor="ownership">Ownership</label>
        <select
          id="ownership"
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

      <div>
        <label htmlFor="facing">Facing</label>
        <select
          id="facing"
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Getting prediction..." : "Predict price"}
      </button>
    </form>
  );
}