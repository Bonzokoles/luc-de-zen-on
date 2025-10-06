# setup.py – Instalator projektu POLACZEK
from setuptools import setup, find_packages

setup(
    name="polaczek_central",
    version="1.0.0",
    description="POLACZEK AI Agent Control Center",
    author="ZENON AI Team",
    packages=find_packages(),
    install_requires=[
        "Flask>=2.2", "Flask_SQLAlchemy>=3.0", "psutil", "GPUtil",
        "PyQt6", "requests", "websockets", "aiofiles",
        "matplotlib", "pandas", "sqlalchemy", "asyncio"
    ],
    entry_points={
        "console_scripts": [
            "polaczek_central_ui=polaczek_central_ui:main",
            "polaczek_central_backend=polaczek_central_backend:main"
        ],
    },
    include_package_data=True,
)