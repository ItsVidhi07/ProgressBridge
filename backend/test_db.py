import asyncio
from sqlalchemy import text
from backend.database import engine

async def test_connection():
    async with engine.connect() as connection:
        result = await connection.execute(text("SELECT 1"))
        print("Database connected successfully!")

asyncio.run(test_connection())