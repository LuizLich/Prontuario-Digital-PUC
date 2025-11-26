from app.database import db
from datetime import datetime

class Paciente(db.Model):
    __tablename__ = 'patients'
    patients_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    cpf = db.Column(db.String(14), unique=True)
    rg = db.Column(db.String(20), unique=True) 

    birthday = db.Column(db.Date)
    number = db.Column(db.String(20))

    intern_id = db.Column(db.Integer, db.ForeignKey('users.users_id')) 
    supervisor_id = db.Column(db.Integer, db.ForeignKey('users.users_id'))

    email = db.Column(db.String(255))
    gender = db.Column(db.String(20))
    race = db.Column(db.String(50)) 
    
    marital_status = db.Column(db.String(50))
    profession = db.Column(db.String(100))
    
    address = db.Column(db.String(255))
    neighborhood = db.Column(db.String(100))
    city = db.Column(db.String(100))
    state = db.Column(db.String(2))
    zip_code = db.Column(db.String(20))
    
    education_level = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    evaluation_date = db.Column(db.Date) 
    discharge_date = db.Column(db.Date) 

    intern = db.relationship('User', foreign_keys=[intern_id])
    supervisor = db.relationship('User', foreign_keys=[supervisor_id])
    
    def __repr__(self):
        return f'<Paciente {self.name}>'

class MedicalRecord(db.Model):
    __tablename__ = "medical_records"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.patients_id"), nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey("forms.forms_id"), nullable=False)

    record_data = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey("users.users_id"), nullable=True)

    # --- NOVOS CAMPOS PARA EDIÇÃO ---
    updated_at = db.Column(db.DateTime, nullable=True)
    updated_by_id = db.Column(db.Integer, db.ForeignKey("users.users_id"), nullable=True)

    # Relacionamentos
    patient = db.relationship("Paciente", backref="medical_records")
    form = db.relationship("Form")
    author = db.relationship("User", foreign_keys=[author_id])
    
    # Novo relacionamento para quem editou
    updated_by = db.relationship("User", foreign_keys=[updated_by_id])
    
    def get_record_data_dict(self):
        """Retorna os dados do prontuário como dicionário Python"""
        import json
        try:
            return json.loads(self.record_data)
        except:
            return {}
        
class User(db.Model):
    __tablename__ = 'users' 

    users_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    registration = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    type_user = db.Column(db.String(20), nullable=False)  # 'admin', 'supervisor', 'intern'

    def __repr__(self):
        return f'<User {self.name}>'

class Form(db.Model):
    __tablename__ = 'forms'

    forms_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    structure_json = db.Column(db.Text, nullable=False)

    # Campo para controle de exclusão lógica
    active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey("users.users_id"), nullable=True)
    
    updated_at = db.Column(db.DateTime, nullable=True)
    updated_by_id = db.Column(db.Integer, db.ForeignKey("users.users_id"), nullable=True)

    author = db.relationship("User", foreign_keys=[author_id])
    updated_by = db.relationship("User", foreign_keys=[updated_by_id])

    def __repr__(self):
        return f'<Form {self.title} (ID: {self.forms_id})>'