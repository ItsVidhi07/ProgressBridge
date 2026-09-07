import asyncio

from backend.database import engine
from backend.models import Base


async def create_tables():
    async with engine.begin() as conn:
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created successfully!")


asyncio.run(create_tables())