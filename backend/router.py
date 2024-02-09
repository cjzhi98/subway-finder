from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic_type import SubwayBase, SubwayBase
from dependency import *
from rag import query_engine

router = APIRouter(
    tags=["Subways"],
    responses={404: {"description": "Not found"}},
)


@router.get("/subways")
async def get_subways(
    lat: float = 3.133075,
    lng: float = 101.687034,
    radius: int = 5,
    db: Session = Depends(get_db),
):
    subways = (
        db.query(Subway)
        .filter(Subway.distance(lat=lat, lng=lng) < radius)
        .order_by(Subway.distance(lat=lat, lng=lng))
        .all()
    )
    for subway in subways:
        subway.distance = subway.distance(lat=lat, lng=lng)
    return subways


@router.post("/subways")
async def create_subway(subway: SubwayBase, db: Session = Depends(get_db)):
    db_subway = Subway(
        name=subway.name,
        address=subway.address,
        waze=subway.waze,
        lat=subway.lat,
        lng=subway.lng,
        business_hours=subway.BusinessHourText,
    )
    db.add(db_subway)
    db.commit()
    db.refresh(db_subway)

    # for business_hour in subway.business_hours:
    #     db_business_hour = BusinessHour(
    #         subway_id=db_subway.subway_id,
    #         day=business_hour.day,
    #         is_open=business_hour.is_open,
    #         first_open=business_hour.first_open,
    #         first_close=business_hour.first_close,
    #         second_open=business_hour.second_open,
    #         second_close=business_hour.second_close,
    #         third_open=business_hour.third_open,
    #         third_close=business_hour.third_close,
    #     )
    #     db.add(db_business_hour)
    # db.commit()

    return {"subway_id": db_subway.subway_id}


@router.get("/question")
async def ask_question(
    question: str,
):
    result = query_engine.query(question)
    return {"question": question, "answer": result.response}
