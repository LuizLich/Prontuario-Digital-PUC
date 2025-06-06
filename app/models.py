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
    password = db.Column(db.String(255), nullable=False)  # Hashing para segurança
    type_user = db.Column(db.String(20), nullable=False)  # Exemplo: 'admin', 'estagiário'
    birthday = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'
    
class Form(db.Model):
    __tablename__ = 'forms'

    forms_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    structure_json = db.Column(db.Text, nullable=False) # Coluna para o JSON do FormBuilder
    # Opcional: created_at e updated_at para rastreamento
    # created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    # updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<Form {self.title} (ID: {self.forms_id})>'