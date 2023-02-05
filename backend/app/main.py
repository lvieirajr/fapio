from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.expeditions.api import router as expeditions_router
from app.farmer.api import router as farmer_router


app = FastAPI(title=settings.NAME)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

main_router = APIRouter(prefix="")
main_router.include_router(farmer_router)
main_router.include_router(expeditions_router)

app.include_router(main_router)
