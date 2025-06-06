from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from app.database import db
from app.models import Paciente, User, Form

main = Blueprint('main', __name__)

@main.route("/")
@main.route("/homepage")
def homepage():
    return render_template("homepage.html")

@main.route('/pacientes')
def pacientes():
    pacientes = Paciente.query.all()
    return render_template('pacientes.html', pacientes=pacientes)

@main.route('/lista_prontuarios')
def lista_prontuarios():
    ##pacientes = Paciente.query.all()
    forms_active = Form.query.all()
    return render_template('lista_prontuarios.html', forms_active=forms_active)

@main.route('/prontuariopaciente')
def prontuariopaciente():
    return render_template('prontuariopaciente.html')

@main.route('/meuperfil')
def meuperfil():
    return render_template('meuperfil.html')

@main.route('/sobre')
def sobre():
    return render_template('sobre.html')

# Área do ADIMIN
@main.route('/usuarios')
def usuarios():
    usuarios = User.query.all()
    return render_template('usuarios.html', usuarios=usuarios)

@main.route('/adicionar_usuario')
def addusuario():
    return render_template('addusuario.html')

@main.route('/criarprontuario')
def criarprontuario():
    return render_template('criarprontuario.html')

@main.route('/salvar_formulario', methods=['POST'])
# @login_required
def salvar_formulario_route():
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Dados inválidos ou não fornecidos."}), 400

    form_name = data.get('name')
    form_structure_json = data.get('structure') # JSON como string

    if not form_name or not form_structure_json:
        return jsonify({"status": "error", "message": "O nome e a estrutura do formulário são obrigatórios."}), 400

    try:
        # Verificar se já existe um formulário com o mesmo título
        existing_form = Form.query.filter_by(title=form_name).first()
        if existing_form:
            # Evitar duplicatas de título
            return jsonify({"status": "error", "message": f"Já existe um formulário com o título '{form_name}'. Por favor, escolha outro título."}), 409

        new_form = Form(title=form_name, structure_json=form_structure_json)
        db.session.add(new_form)
        db.session.commit()
        
        return jsonify({
            "status": "success", 
            "message": "Formulário salvo com sucesso!", 
            "form_id": new_form.forms_id
        }), 201 # 201 Created
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao salvar formulário no banco de dados: {str(e)}")
        return jsonify({"status": "error", "message": "Ocorreu um erro interno ao tentar salvar o formulário"}), 500
    
@main.route('/novopaciente')
def novopaciente():
    # Buscar todos os formulários com apenas ID e título para popular o dropdown
    available_forms = Form.query.with_entities(Form.forms_id, Form.title).order_by(Form.title).all()
    
    # Converte a lista de tuplas para uma lista de dicionários para facilitar o uso no template
    form_options = [{"id": form_template.forms_id, "title": form_template.title} for form_template in available_forms]
    
    return render_template('novopaciente.html', form_options=form_options)

@main.route('/get_form_structure/<int:form_id>')
def get_form_structure(form_id):
    form_template = Form.query.get_or_404(form_id) # Retorna 404 se o formulário não for encontrado
    if form_template and form_template.structure_json:
        # O cliente (jQuery/formRender) espera o JSON.
        return jsonify({
            "status": "success",
            "form_id": form_template.forms_id,
            "title": form_template.title,
            "structure_json": form_template.structure_json 
        })
    # get_or_404 caso de não encontrar:
    return jsonify({"status": "error", "message": "A estrutura desse formulário não foi encontrada"}), 404