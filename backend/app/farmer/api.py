from gzip import GzipFile
from io import BytesIO
from uuid import UUID

from fastapi import APIRouter, File, Form
from sqlalchemy.orm import Session

from app.core.db import DB
from app.farmer.repositories import FarmerRepository
from app.farmer.schemas import Farmer


router = APIRouter(prefix="/farmer")


@router.get("/{farmer_id}", status_code=200, response_model=Farmer)
async def get_farmer(farmer_id: UUID, db: Session = DB,) -> Farmer:
    return FarmerRepository(db=db).get_one(farmer_id=farmer_id)


@router.post("/upload", status_code=200, response_model=Farmer)
async def upload_save_file(
    save_file: bytes = File(),
    farmer_id: UUID | None = Form(None),
    db: Session = DB,
) -> Farmer:
    save_file_contents = GzipFile(fileobj=BytesIO(save_file)).read().decode("utf-8")
    save_file_contents = save_file_contents[:save_file_contents.rindex("}") + 1]

    return FarmerRepository(db=db).store_farmer_save(
        farmer_id=farmer_id if farmer_id else None,
        save_file_contents=save_file_contents,
    )
