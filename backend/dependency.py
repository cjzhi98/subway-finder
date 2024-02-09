from init import SessionLocal, engine
from database import *
from sqlalchemy import inspect


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


tables = ["subway", "business_hour"]

for table in tables:
    if not inspect(engine).has_table(table):
        Base.metadata.create_all(engine)
