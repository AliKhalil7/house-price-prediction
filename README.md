# House Price Prediction — End-to-End ML Web App

Predicts Indian house prices from property details (area, floor, bathrooms, furnishing, etc.) using a trained ML model, served through a FastAPI backend and a React frontend.

## How it works
React Form → FastAPI /predict → RandomForest model (.pkl) → Predicted price

> FYI: `.pkl` (pickle) is a file format for saving a trained Python object

The model was trained in a Jupyter notebook on the [House Price dataset](https://www.kaggle.com/datasets/juhibhojani/house-price) from Kaggle.

## Features

- Cleans and processes around 187,000 real property listings from India
- Compares 3 regression models (Linear Regression, Gradient Boosting, Random Forest)
- Serves predictions through a REST API
- Simple React form for entering property details and viewing the predicted price

## Tech Stack

Python, pandas, scikit-learn (model) - FastAPI (backend) - React + TypeScript + Vite (frontend)

## Project Structure
notebooks/ → data cleaning, training, model export
backend/ → FastAPI app that serves predictions
frontend/ → React form + result page


## Setup

### 1. Get the dataset & train the model
```bash
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```
Run `notebooks/house_price_model.ipynb` top to bottom. This produces `house_price.pkl` and `locations.json`.

> `house_price.pkl` isn't in this repo (it's 346MB, over GitHub's limit '<50MB') — you must generate it by running the notebook, then copy it into `backend/models/`.

> **Note:** the backend requires the exact scikit-learn version used in training (see `requirements.txt`) — a version mismatch can cause the pickle to fail to load.

### 2. Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs at `http://localhost:8000` (docs at `/docs`).

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

## Environment Variables

Frontend (`frontend/.env`):

- `VITE_API_BASE_URL` — base URL of the backend API (e.g. `http://localhost:8000`)

See `.env.example` for a template.

## API Example

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"location":"bangalore","carpet_area_sqft":1200,"floor_num":3,"bathroom":2,"balcony":1,"furnishing":"Semi-Furnished","transaction":"Resale","ownership":"Freehold","facing":"East"}'
```
Response: `{ "predicted_price": 10621500 }`

## Model Performance

| Model                      | MAE        | RMSE      | R²        |
|----------------------------|------------|-----------|-----------|
| **Random Forest (chosen)** | 1,354,452  | 5,705,804 | **0.826** |
| Gradient Boosting          | 3,195,780  | 6,771,222 | 0.755     |
| Linear Regression          | 4,687,508  | 8,890,567 | 0.578     |

Random Forest had the best performance and was used for the final model.

## Screenshots

![Prediction form](screenshots/form.png)
![Predicted price result page](screenshots/result.png)
![Validation error message](screenshots/ErrorMessage.png)
![FastAPI docs](screenshots/api-docs.png)