from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router as prediction_router
from app.services import inference  # noqa: F401  (triggers model load on import)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Model is loaded once at import time inside app.services.inference
    # (see MODEL_PATH / joblib.load in inference.py). Nothing extra needed
    # here, but this is the hook if you ever want to warm up caches, etc.
    yield


app = FastAPI(title="House Price Prediction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)