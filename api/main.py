from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["images_db"]
collection = db["images_collection"]

app = FastAPI()

class ImageURL(BaseModel):
    imageUrl: str

class PaginatedImages(BaseModel):
    data: list[ImageURL]
    total: int
    page: int
    per_page: int


@app.get("/images", response_model=PaginatedImages)
async def get_paginated_images(page: int = Query(1, ge=1), per_page: int = Query(6, ge=1, le=100)):

    if page < 1 or per_page < 1 or per_page > 100:
        raise HTTPException(status_code=400, detail="Invalid page or per_page value")

    skip = (page - 1) * per_page
    image_urls = [ImageURL(imageUrl=doc["imageUrl"]) for doc in collection.find().skip(skip).limit(per_page)]
    total_images = collection.count_documents({})

    return PaginatedImages(data=image_urls, total=total_images, page=page, per_page=per_page)
