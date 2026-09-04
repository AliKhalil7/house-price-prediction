import json
import pandas as pd

from app.schemas.prediction import PredictionRequest


with open("app/data/locations.json") as f:
    KNOWN_LOCATIONS = set(json.load(f))


def request_to_dataframe(request: PredictionRequest) -> pd.DataFrame:
    """Convert an incoming prediction request into a one-row DataFrame
    matching the exact column names the model was trained on."""

    
    location_grouped = request.location if request.location in KNOWN_LOCATIONS else "other"

    row = {
        "carpet_area_sqft": request.carpet_area_sqft,
        "floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "location_grouped": location_grouped,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
    }

    return pd.DataFrame([row])