import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)

    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        # Corrige a URL do Render para funcionar com SQLAlchemy
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    else:
        # Manter conexão local
        DATABASE_URL = 'mysql+pymysql://root@localhost/db_fisio'

    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    from app.database import db
    db.init_app(app)
    
    migrate = Migrate(app, db)

    from app.views import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app