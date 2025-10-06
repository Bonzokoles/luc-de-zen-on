# polaczek_postgres_mongo.py – Rozbudowa bazy na Postgres/Mongo
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymongo

Base = declarative_base()

class Agent(Base):
    __tablename__ = "agents"
    id = Column(String, primary_key=True)
    name = Column(String)
    type = Column(String)
    role = Column(String)
    status = Column(String)
    description = Column(String)
    endpoint = Column(String)

def setup_postgres():
    engine = create_engine("postgresql+asyncpg://user:password@localhost/polaczek_db")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()

def setup_mongo():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["polaczek_db"]
    return db["agents"]

def main():
    pg_session = setup_postgres()
    mongo_agents = setup_mongo()
    print("Postgres i Mongo skonfigurowane!")

if __name__ == "__main__":
    main()