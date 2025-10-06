# polaczek_full_installer.py – Pełna instalacja: pip, conda, build EXE, auto-detekcja GPU, DB
import subprocess, sys, os

def install_pip():
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def install_conda():
    subprocess.run(["conda", "env", "update", "--file", "environment.yml", "--prune"])

def build_exe():
    subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"])
    subprocess.run(["pyinstaller", "--onefile", "polaczek_gui.py"])

def detect_gpu():
    try:
        import GPUtil
        gpus = GPUtil.getGPUs()
        for gpu in gpus:
            print(f"GPU: {gpu.name} ({gpu.memoryTotal}MB)")
    except Exception:
        print("GPUtil not installed or no GPU detected.")

def setup_db():
    try:
        import sqlalchemy; import pymongo
        print("SQLAlchemy version:", sqlalchemy.__version__)
        print("PyMongo version:", pymongo.__version__)
    except Exception as e:
        print("DB modules not installed:", e)

def main():
    print("POLACZEK Full Installer")
    print("1. Install pip packages\n2. Install conda packages\n3. Build EXE\n4. Check GPU\n5. Check DB\n6. Exit")
    choice = input("Choose: ")
    if choice == "1": install_pip()
    elif choice == "2": install_conda()
    elif choice == "3": build_exe()
    elif choice == "4": detect_gpu()
    elif choice == "5": setup_db()
    else: print("Exit.")

if __name__ == "__main__":
    main()