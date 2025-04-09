from app import create_app, db, bcrypt
from app.models.user import User
from app.models.place import Place
from app.models.amenity import Amenity
from app.models.review import Review


app = create_app()
app.app_context().push()

print("🔄 Resetting all tables...")
db.drop_all()
db.session.commit()
db.create_all()
print("✅ Tables dropped & recreated.")

print("👤 Creating admin...")
admin = User(
    first_name='Admin',
    last_name='HBnB',
    email='admin@hbnb.io',
    password='password123',
    is_admin=True
)
db.session.add(admin)
db.session.commit() 

print("👥 Creating demo users...")
alice = User(
    first_name='Alice',
    last_name='Walker',
    email='alice@example.com',
    password='alicepass123',
    is_admin=False
)
bob = User(
    first_name='Bob',
    last_name='Johnson',
    email='bob@example.com',
    password='bobsecure456',
    is_admin=False
)
db.session.add_all([alice, bob])
db.session.commit()
print("✅ 2 demo users added.")

# 3. Amenities
print("🏷 Adding amenities...")
amenities = [
    Amenity(name='WiFi'),
    Amenity(name='Pool'),
    Amenity(name='Air Conditioning')
]
db.session.add_all(amenities)
db.session.commit()
print(f"✅ {len(amenities)} amenities added.")

# 4. Places
print("🏠 Adding places...")
places = [
    Place(
        title='Beautiful Beach House',
        description='A lovely beach house with ocean view.',
        price=150.00,
        latitude=34.0195,
        longitude=-118.4912,
        user_id=alice.id
    ),
    Place(
        title='Cozy Cabin',
        description='A warm and rustic cabin in the woods.',
        price=100.00,
        latitude=44.0582,
        longitude=-121.3153,
        user_id=bob.id
    ),
    Place(
        title='Modern Apartment',
        description='An apartment in the heart of the city.',
        price=200.00,
        latitude=40.7128,
        longitude=-74.0060,
        user_id=alice.id
    ),
    Place(
        title='Mountain Chalet',
        description='A peaceful retreat surrounded by mountains.',
        price=180.00,
        latitude=46.8182,
        longitude=8.2275,
        user_id=bob.id
    ),
    Place(
        title='Lake House',
        description='Tranquil home next to a lake.',
        price=130.00,
        latitude=45.5017,
        longitude=-73.5673,
        user_id=alice.id
    ),
    Place(
        title='Desert Villa',
        description='Luxurious escape in the desert.',
        price=220.00,
        latitude=36.1699,
        longitude=-115.1398,
        user_id=bob.id
    ),
    Place(
        title='Downtown Loft',
        description='Stylish loft in a vibrant area.',
        price=170.00,
        latitude=41.8781,
        longitude=-87.6298,
        user_id=alice.id
    ),
]
db.session.add_all(places)
db.session.commit()
print(f"✅ {len(places)} places added.")


# 4. Reviews
print("📝 Adding reviews...")

reviews = [
    Review(
        text="Great stay with an amazing view!",
        rating=5,
        user_id=bob.id,
        place_id=places[0].id  # Beach House
    ),
    Review(
        text="Perfect for a quiet weekend getaway.",
        rating=4,
        user_id=alice.id,
        place_id=places[1].id  # Cozy Cabin
    ),
    Review(
        text="Very modern and well located.",
        rating=5,
        user_id=bob.id,
        place_id=places[2].id  # Modern Apartment
    ),
    Review(
        text="Lovely lake views, would visit again.",
        rating=4,
        user_id=bob.id,
        place_id=places[4].id  # Lake House
    ),
]

db.session.add_all(reviews)
db.session.commit()
print(f"✅ {len(reviews)} reviews added.")
