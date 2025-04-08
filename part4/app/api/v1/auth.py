from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from app.services.facade import HBnBFacade
facade = HBnBFacade()

api = Namespace('auth', description='Authentication operations')

# Model for input validation
login_model = api.model('Login', {
	'email': fields.String(required=True, description='User email'),
	'password': fields.String(required=True, description='User password')
})

@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """Authenticate user and return a JWT token"""
        credentials = api.payload
        print(f"[DEBUG] Payload reçu: {credentials}")

        if not credentials or 'email' not in credentials or 'password' not in credentials:
            return {'error': 'Missing email or password'}, 400

        user = facade.get_user_by_email(credentials['email'])
        print(f"[DEBUG] Utilisateur trouvé: {user}")

        if not user:
            return {'error': 'Invalid email or password'}, 401

        if not user.verify_password(credentials['password']):
            print(f"[DEBUG] Mot de passe invalide pour: {credentials['email']}")
            return {'error': 'Invalid email or password'}, 401

        try:
            access_token = create_access_token(
                identity=user.id,
                additional_claims={'is_admin': user.is_admin}
            )
        except Exception as e:
            print(f"[ERROR] Token creation failed: {e}")
            return {'error': str(e).strip("'")}, 500

        print(f"[DEBUG] Authentification réussie pour: {user.email}")
        return {'access_token': access_token}, 200
