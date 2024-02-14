# Subway Finder

This project focus mainly on the integration between backend and the frontend, there are not much effort put into the design (UI/UX) of frontend.

## Running the Project

#### Environment Variables

Inside `backend` folder, create a .env file, with the content below

```
DB_URL=sqlite:///database.db # we use sqlite as a database
REPLICATE_API_TOKEN={REPLICATE_API_KEY}
```

Inside `frontend` folder, create `.env` with the content below

```
API_HOST=http://localhost:5001
```

<em>P.S. Remember to use https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?pli=1 to bypass the CORS error on browser.</em>

### Without Docker

#### Backend

Inside `backend` folder, use `pip` to install the python dependencies

```
pip install -r requirements.txt
```

Use `uvicorn` to start the fastapi service in dev mode

```
uvicorn main:app --reload --port 5001
```

#### Frontend

Inside `frontend` folder, use `npm` to start the nextjs frontend

```
npm run dev
```

## A Glimpse of the Frontend

![alt text](image/image.png)
