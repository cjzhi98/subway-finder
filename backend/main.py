from pydantic_type import *
from fastapi import FastAPI
from router import router


app = FastAPI()


@app.get("/")
def hello_world():
    return {"msg": "Hello World"}


app.include_router(router)
