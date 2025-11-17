import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

def create_app():
    # Carrega as variáveis de ambiente do arquivo .env
    load_dotenv()

    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

    # Se quiser, adiciona um fallback para evitar crash em debug
    if not app.config['SECRET_KEY']:
        raise RuntimeError("SECRET_KEY não definida no .env! Adicione SECRET_KEY no seu arquivo .env")

    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        # Corrige a URL do Render para funcionar com SQLAlchemy
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    else:
        # Manter conexão local
        DATABASE_URL = os.environ.get('DATABASE_URL_LOCAL')

    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    from app.database import db
    db.init_app(app)
    
    migrate = Migrate(app, db)

    from app.views import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app