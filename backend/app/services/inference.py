import joblib
import pandas as pd

MODEL_PATH = "models/house_price.pkl"

# Loaded once when this module is first imported (not on every request)
model = joblib.load(MODEL_PATH)


def predict_price(row: pd.DataFrame) -> float:
    """Run the trained pipeline on a one-row DataFrame and return the prediction."""
    prediction = model.predict(row)[0]
    return float(prediction)