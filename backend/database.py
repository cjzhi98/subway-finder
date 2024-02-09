from init import Base

from sqlalchemy import Column, Integer, String, ForeignKey, Text, Time, Float
from sqlalchemy.ext.hybrid import hybrid_method
from sqlalchemy import func
from math import cos, sin, radians, acos


class Subway(Base):
    __tablename__ = "subway"

    subway_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    address = Column(String(255))
    lat = Column(Float)
    lng = Column(Float)
    waze = Column(Text)
    business_hours = Column(Text)  # e.g.Monday - Sunday, 9:00 AM - 9:00 PM

    def __init__(self, name, address, lat, lng, waze, business_hours):
        self.name = name
        self.address = address
        self.lat = lat
        self.lng = lng
        self.waze = waze
        self.business_hours = business_hours

    @hybrid_method
    def distance(self, lat, lng):
        return 6371 * (
            acos(
                cos(radians(lat))
                * cos(radians(self.lat))
                * cos(radians(self.lng) - radians(lng))
                + sin(radians(lat)) * sin(radians(self.lat))
            )
        )

    @distance.expression
    def distance(cls, lat, lng):
        return 6371 * (
            func.acos(
                func.cos(func.radians(lat))
                * func.cos(func.radians(cls.lat))
                * func.cos(func.radians(cls.lng) - func.radians(lng))
                + func.sin(func.radians(lat)) * func.sin(func.radians(cls.lat))
            )
        )


class BusinessHour(Base):
    __tablename__ = "business_hour"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subway_id = Column(Integer, ForeignKey("subway.subway_id"))
    day = Column(String(255))
    is_open = Column(String(255), nullable=False)
    first_open = Column(Time)
    first_close = Column(Time)
    second_open = Column(Time)
    second_close = Column(Time)
    third_open = Column(Time)
    third_close = Column(Time)

    def __init__(
        self,
        subway_id,
        day,
        is_open,
        first_open,
        first_close,
        second_open,
        second_close,
        third_open,
        third_close,
    ):
        self.subway_id = subway_id
        self.day = day
        self.is_open = is_open
        self.first_open = first_open
        self.first_close = first_close
        self.second_open = second_open
        self.second_close = second_close
        self.third_open = third_open
        self.third_close = third_close
