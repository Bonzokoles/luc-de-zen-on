# environment.yml – Instalacja przez conda/anaconda
name: polaczek_central
channels:
  - defaults
  - conda-forge
dependencies:
  - python=3.10
  - flask
  - flask-sqlalchemy
  - pyqt
  - requests
  - psutil
  - gputil
  - matplotlib
  - pandas
  - sqlalchemy
  - websockets
  - aiofiles
  - asyncpg    # Postgres driver
  - pymongo    # MongoDB driver
  - cryptography
  - cloudflared