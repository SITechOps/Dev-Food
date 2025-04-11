import pytz
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, DateTime
from datetime import datetime

tz_sp = pytz.timezone("America/Sao_Paulo")

class Base(DeclarativeBase):
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(tz_sp))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(tz_sp), onupdate=lambda: datetime.now(tz_sp))
