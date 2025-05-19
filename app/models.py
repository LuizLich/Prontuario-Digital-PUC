from app.database import db

class Paciente(db.Model):
    __tablename__ = 'patients'

    patients_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    cpf = db.Column(db.String(14))
    birthday = db.Column(db.Date)
    number = db.Column(db.String(100))
    intern_id = db.Column(db.String(100))
    supervisor_id = db.Column(db.String(100))

class User(db.Model):
    __tablename__ = 'users' 

    users_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    registration = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Use hashing para segurança
    type_user = db.Column(db.String(20), nullable=False)  # Exemplo: 'admin', 'standard'
    birthday = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'