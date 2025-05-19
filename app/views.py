from flask import Blueprint, render_template, redirect, url_for
from app.database import db
from app.models import Paciente
from app.models import User

main = Blueprint('main', __name__)

@main.route("/")
@main.route("/homepage")
def homepage():
    return render_template("homepage.html")

@main.route('/addpaciente')
def addpaciente():
    return render_template('addpaciente.html')

@main.route('/pesquisa')
def pesquisa():
    pacientes = Paciente.query.all()
    return render_template('pesquisa.html', pacientes=pacientes)

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
    usuarios = User.query.all()
    return render_template('usuarios.html', usuarios=usuarios)

@main.route('/adicionar_usuario')
def addusuario():
    return render_template('addusuario.html')

@main.route('/delete_user/<int:users_id>', methods=['POST'])
def delete_user(users_id):  # Agora usando 'users_id'
    user = User.query.get_or_404(users_id)  # Busca o usuário pelo ID correto
    db.session.delete(user)  # Exclui o usuário do banco
    db.session.commit()  # Salva as alterações

    return redirect(url_for('main.usuarios'))  # Redireciona para a lista de usuários