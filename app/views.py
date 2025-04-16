from flask import Blueprint, render_template
from app import templates

main = Blueprint('main', __name__)

@main.route("/")
def homepage():
    return render_template("homepage.html")

@main.route('/addpaciente')
def addpaciente():
    return render_template('addpaciente.html')

@main.route('/pesquisa')
def pesquisa():
    return render_template('pesquisa.html')

@main.route('/prontuariopaciente')
def prontuariopaciente():
    return render_template('prontuariopaciente.html')

@main.route('/meuperfil')
def meuperfil():
    return render_template('meuperfil.html')

@main.route('/sobre')
def sobre():
    return render_template('sobre.html')


# Apenas para ADIMIN
@main.route('/usuarios')
def usuarios():
    return render_template('usuarios.html')