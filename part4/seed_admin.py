from app import create_app, db, bcrypt
from app.models.user import User

app = create_app()
app.app_context().push()

# Vérifie si l'admin existe déjà
admin = User.query.filter_by(email='admin@hbnb.io').first()
if admin:
    print("ℹ️ Admin déjà présent :", admin.email)
else:
    hashed_pwd = bcrypt.generate_password_hash('password123').decode('utf-8')
    admin = User(
        first_name='Admin',
        last_name='HBnB',
        email='admin@hbnb.io',
        password='password123',
        is_admin=True
    )
    db.session.add(admin)
    db.session.commit()
    print("✅ Admin ajouté avec succès :", admin.email)
