from pydantic import BaseModel


class PredictionRequest(BaseModel):
    location: str
    carpet_area_sqft: float
    floor_num: int
    bathroom: int
    balcony: int
    furnishing: str      
    transaction: str     
    ownership: str
    facing: str


class PredictionResponse(BaseModel):
    predicted_price: float