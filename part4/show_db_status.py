from app import create_app, db
import os
import sqlite3

app = create_app()
app.app_context().push()

# Extraire l'URI
uri = app.config["SQLALCHEMY_DATABASE_URI"]
print("🔍 Base utilisée :", uri)

# Vérifier si SQLite
if not uri.startswith("sqlite:///"):
    print("❌ Ce n'est pas une base SQLite.")
    exit()

# Chemin absolu
path = uri.replace("sqlite:///", "")
abs_path = os.path.abspath(path)
print("📍 Chemin absolu :", abs_path)

# Vérifier l'existence du fichier
if not os.path.exists(abs_path):
    print("❌ Le fichier n'existe pas.")
    exit()
else:
    print("✅ Le fichier existe.")

# Connexion à SQLite pour lister les tables
conn = sqlite3.connect(abs_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]

print("📋 Tables dans la base :")
print(tables if tables else "❌ Aucune table trouvée.")

conn.close()
