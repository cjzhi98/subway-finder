from typing import List
from pydantic import BaseModel
from datetime import time


class BusinessHourBase(BaseModel):
    day: str
    is_open: str
    first_open: time
    first_close: time
    second_open: time
    second_close: time
    third_open: time
    third_close: time


class SubwayBase(BaseModel):
    name: str
    address: str
    lat: float
    lng: float
    waze: str
    BusinessHourText: str
    # business_hours: List[BusinessHourBase]
