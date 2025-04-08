from app import create_app, db

app = create_app()
app.app_context().push()

print("📋 Tables disponibles dans la DB :")
print(db.inspect(db.engine).get_table_names())
