from app import create_app, db

# Import explicite des modèles
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity
from app.models.amenities_places import AmenityPlace

app = create_app()
app.app_context().push()

print("📦 Modèles SQLAlchemy enregistrés :")
from sqlalchemy.orm import DeclarativeBase

# lister tous les modèles qui héritent de BaseModel
for cls in db.Model.registry.mappers:
    print(f" - {cls.class_.__name__}")

# Création des tables
db.create_all()
print("✅ Tables SQLAlchemy créées")
