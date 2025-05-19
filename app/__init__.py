from flask import Flask, url_for, flash, redirect
from flask_sqlalchemy import SQLAlchemy
import pymysql
from app.views import main
from flask_migrate import Migrate

pymysql.install_as_MySQLdb()

def create_app():
    app = Flask(__name__)
    #app.config['SECRET_KEY'] = ''
    conexao = 'mysql://root@localhost/db_fisio'
    app.config['SQLALCHEMY_DATABASE_URI'] = conexao
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/db_fisio'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    from app.database import db
    
    db.init_app(app)
    migrate = Migrate(app, db)

    from app.views import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app