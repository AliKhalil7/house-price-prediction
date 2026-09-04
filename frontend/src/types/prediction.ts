// Mirrors the backend's PredictionRequest schema (app/schemas/prediction.py)
export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: string; // "Furnished" | "Semi-Furnished" | "Unfurnished"
  transaction: string; // "New Property" | "Resale"
  ownership: string;
  facing: string;
}

// Mirrors the backend's PredictionResponse schema
export interface PredictionResponse {
  predicted_price: number;
}