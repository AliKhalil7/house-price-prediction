from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_predict_happy_path():
    payload = {
        "location": "Whitefield",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], float)


def test_predict_invalid_input():
    # Missing most required fields, and carpet_area_sqft is the wrong type
    payload = {
        "location": "Whitefield",
        "carpet_area_sqft": "not-a-number",
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 422