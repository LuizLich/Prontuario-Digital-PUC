from flask import Blueprint, render_template, redirect, url_for, request, jsonify, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from app.database import db
from app.models import Paciente, User, Form
from app.auth import login_required

main = Blueprint('main', __name__)

@main.route("/")
@main.route("/homepage")
def homepage():
    user_name = session.get("user_name", "")
    return render_template("homepage.html", user_name=user_name)

@main.before_app_request
def require_login_for_every_page():
    if request.endpoint is None:
        return

    public_endpoints = {
        "main.login",
        "main.register",
        "static"
    }

    # Se o usuário não está logado e tenta acessar alguma rota protegida
    if request.endpoint not in public_endpoints and "user_id" not in session:
        return redirect(url_for("main.login"))

@main.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        registration = request.form['registration']
        password = request.form['password']
        type_user = request.form['type_user']

        # Hash da senha
        hashed_pw = generate_password_hash(password)

        # Verificação de duplicidade
        existing_email = User.query.filter_by(email=email).first()
        existing_reg = User.query.filter_by(registration=registration).first()
        existing_name = User.query.filter_by(name=name).first()

        if existing_email or existing_reg or existing_name:
            flash("Nome, email ou matrícula já estão cadastrados!")
            return redirect('/register')

        new_user = User(
            name=name,
            email=email,
            registration=registration,
            password=hashed_pw,
            type_user=type_user
        )

        db.session.add(new_user)
        db.session.commit()

        flash("Conta criada com sucesso! Faça login.")
        return redirect('/login')

    return render_template('register.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            flash("Email ou senha incorretos!", "danger")
            return redirect(url_for('main.login'))

        session['user_id'] = user.users_id
        session['user_name'] = user.name
        session['user_type'] = user.type_user

        return redirect(url_for('main.homepage'))

    return render_template('login.html')

@main.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main.login'))

@main.route('/pacientes')
def pacientes():
    pacientes = Paciente.query.all()
    return render_template('pacientes.html', pacientes=pacientes)

@main.route('/lista_prontuarios')
def lista_prontuarios():
    forms_active = Form.query.all()
    return render_template('lista_prontuarios.html', forms_active=forms_active)

@main.route('/prontuariopaciente')
def prontuariopaciente():
    return render_template('prontuariopaciente.html')

@main.route('/meuperfil')
def meuperfil():
    user_id = session.get("user_id")

    if not user_id:
        return redirect(url_for("main.login"))

    user = User.query.get(user_id)

    return render_template('meuperfil.html', user=user)

@main.route('/sobre')
def sobre():
    return render_template('sobre.html')

# Área do ADMIN
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
def salvar_formulario_route():
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Dados inválidos ou não fornecidos."}), 400

    form_name = data.get('name')
    form_structure_json = data.get('structure')  # JSON como string

    if not form_name or not form_structure_json:
        return jsonify({"status": "error", "message": "O nome e a estrutura do formulário são obrigatórios."}), 400

    try:
        # Verificar se já existe um formulário com o mesmo título
        existing_form = Form.query.filter_by(title=form_name).first()
        if existing_form:
            return jsonify({"status": "error", "message": f"Já existe um formulário com o título '{form_name}'. Por favor, escolha outro título."}), 409

        new_form = Form(title=form_name, structure_json=form_structure_json)
        db.session.add(new_form)
        db.session.commit()
        
        return jsonify({
            "status": "success", 
            "message": "Formulário salvo com sucesso!", 
            "form_id": new_form.forms_id
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao salvar formulário no banco de dados: {str(e)}")
        return jsonify({"status": "error", "message": "Ocorreu um erro interno ao tentar salvar o formulário"}), 500


# EDITAR FORMULÁRIO
@main.route('/editar_form/<int:form_id>', methods=['GET'])
def editar_form(form_id):
    form = Form.query.get_or_404(form_id)
    return render_template(
        'criarprontuario.html',
        form_id=form.forms_id,
        title=form.title,
        structure_json=form.structure_json
    )

# ATUALIZAR FORMULÁRIO
@main.route('/atualizar_formulario/<int:form_id>', methods=['POST'])
def atualizar_formulario(form_id):
    form = Form.query.get_or_404(form_id)
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Dados inválidos ou não fornecidos."}), 400

    form_name = data.get('name')
    form_structure_json = data.get('structure')

    if not form_name or not form_structure_json:
        return jsonify({"status": "error", "message": "O nome e a estrutura do formulário são obrigatórios."}), 400

    try:
        # Atualiza os dados
        form.title = form_name
        form.structure_json = form_structure_json
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Formulário atualizado com sucesso!",
            "form_id": form.forms_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": f"Erro ao atualizar: {str(e)}"}), 500

# PACIENTE
@main.route("/paciente/<int:id>")
def visualizar_paciente(id):
    paciente = Paciente.query.get_or_404(id)
    return render_template("visualizar_paciente.html", paciente=paciente)

@main.route('/novopaciente')
def novopaciente():

    available_forms = Form.query.with_entities(Form.forms_id, Form.title).order_by(Form.title).all()
    form_options = [{"id": form_template.forms_id, "title": form_template.title} for form_template in available_forms]

    supervisors = User.query.filter(User.type_user.in_(["admin", "supervisor"])).all()
    interns = User.query.filter_by(type_user="intern").all()

    return render_template(
        'novopaciente.html',
        form_options=form_options,
        supervisors=supervisors,
        interns=interns
    )

@main.route('/salvarpaciente', methods=['POST'])
def salvar_paciente():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "JSON não recebido"}), 400

    cpf_limpo = data.get("cpf")
    if cpf_limpo:
        paciente_existente = Paciente.query.filter_by(cpf=cpf_limpo).first()
        if paciente_existente:
            return jsonify({"success": False, "message": "Já existe um paciente cadastrado com este CPF."}), 409

    def parse_date(date_str):
        if not date_str: return None
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return None

    try:
        new_patient = Paciente(
            name=data.get("nome"),
            cpf=cpf_limpo,
            rg=data.get("rg"),           
            
            birthday=parse_date(data.get("data_nascimento")),
            evaluation_date=parse_date(data.get("data_avaliacao")),
            discharge_date=parse_date(data.get("data_alta")), 

            number=data.get("celular"),
            email=data.get("email"),
            
            intern_id=int(data.get("intern_id")) if data.get("intern_id") else None,
            supervisor_id=int(data.get("supervisor_id")) if data.get("supervisor_id") else None,

            gender=data.get("genero"),
            race=data.get("raca_etnia"), 
            marital_status=data.get("estado_civil"),
            profession=data.get("situacao_profissional"),
            education_level=data.get("escolaridade"),

            address=data.get("endereco"),
            neighborhood=data.get("bairro"), 
            city=data.get("cidade"),
            state=data.get("estado"),        
            zip_code=data.get("cep"),       

            notes=data.get("situacao_outra_texto")
        )
        
        db.session.add(new_patient)
        db.session.flush() 

        prontuario_data = data.get("prontuario_json")
        form_id_selecionado = data.get("prontuario_id")

        if prontuario_data and form_id_selecionado:
             new_record = MedicalRecord(
                patient_id=new_patient.patients_id,
                form_id=int(form_id_selecionado),
                author_id=int(data.get("intern_id")) if data.get("intern_id") else 1,
                record_data=json.dumps(prontuario_data)
            )
             db.session.add(new_record)

        db.session.commit()
        return jsonify({"success": True, "message": "Paciente salvo com sucesso!"})

    except Exception as e:
        db.session.rollback()
        print(f"Erro ao salvar: {str(e)}")
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500

@main.route('/excluir_paciente/<int:id>')
def excluir_paciente(id):
    paciente = Paciente.query.get_or_404(id)

    try:
        # 1. Apagar prontuários associados primeiro (Para evitar erro de chave estrangeira)
        #MedicalRecord.query.filter_by(patient_id=id).delete()

        # 2. Apagar o paciente
        db.session.delete(paciente)
        db.session.commit()
        
        # print(f"Paciente {paciente.name} excluído com sucesso.") 
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao excluir: {e}")
        # Em produção, idealmente usar flash messages
        return f"Erro ao excluir: {str(e)}", 500

    return redirect(url_for('main.pacientes'))


    if not data:
        return jsonify({"success": False, "message": "JSON não recebido"}), 400

    # Verificação de duplicidade de CPF
    cpf_limpo = data.get("cpf")
    paciente_existente = Paciente.query.filter_by(cpf=cpf_limpo).first()
    if paciente_existente:
        return jsonify({"success": False, "message": "Já existe um paciente cadastrado com este CPF."}), 409

    # Função auxiliar para converter datas
    def parse_date(date_str):
        if not date_str: return None
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return None

    try:
        new_patient = Paciente(
            name=data.get("nome"),
            cpf=cpf_limpo,
            rg=data.get("rg"), # NOVO
            birthday=parse_date(data.get("data_nascimento")),
            
            # Datas Clínicas
            evaluation_date=parse_date(data.get("data_avaliacao")), # NOVO
            discharge_date=parse_date(data.get("data_alta")),       # NOVO

            number=data.get("celular"),
            email=data.get("email"),
            
            intern_id=int(data.get("intern_id")) if data.get("intern_id") else None,
            supervisor_id=int(data.get("supervisor_id")) if data.get("supervisor_id") else None,

            gender=data.get("genero"),
            race=data.get("raca_etnia"), # NOVO
            marital_status=data.get("estado_civil"),
            profession=data.get("situacao_profissional"),
            
            address=data.get("endereco"),
            neighborhood=data.get("bairro"), # NOVO
            city=data.get("cidade"),
            state=data.get("estado"),
            zip_code=data.get("cep"),
            
            education_level=data.get("escolaridade"),
            notes=data.get("situacao_outra_texto")
        )
        
        db.session.add(new_patient)
        db.session.flush() 

        # Salvar Prontuário
        prontuario_data = data.get("prontuario_json")
        if prontuario_data and data.get("prontuario_id"):
             new_record = MedicalRecord(
                patient_id=new_patient.patients_id,
                form_id=int(data.get("prontuario_id")),
                author_id=int(data.get("intern_id")),
                record_data=json.dumps(prontuario_data)
            )
             db.session.add(new_record)

        db.session.commit()
        return jsonify({"success": True, "message": "Paciente salvo com sucesso!"})

    except Exception as e:
        db.session.rollback()
        # print(str(e)) # Descomente para ver erro no terminal se precisar
        return jsonify({"success": False, "message": f"Erro ao salvar no banco: {str(e)}"}), 500

@main.route('/editar_paciente/<int:id>')
def editar_paciente(id):
    paciente = Paciente.query.get_or_404(id)
    
    supervisors = User.query.filter(User.type_user.in_(["admin", "supervisor"])).all()
    interns = User.query.filter_by(type_user="intern").all()

    return render_template(
        'editarpaciente.html', 
        paciente=paciente,
        supervisors=supervisors,
        interns=interns
    )

@main.route('/atualizar_paciente/<int:id>', methods=['POST'])
def atualizar_paciente(id):
    paciente = Paciente.query.get_or_404(id)
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "JSON não recebido"}), 400

    try:
        paciente.name = data.get("nome")
        paciente.cpf = data.get("cpf")
        paciente.rg = data.get("rg")
        paciente.number = data.get("celular")
        paciente.email = data.get("email")
        paciente.gender = data.get("genero")
        paciente.marital_status = data.get("estado_civil")
        paciente.profession = data.get("situacao_profissional")
        paciente.address = data.get("endereco")
        paciente.neighborhood = data.get("bairro")
        paciente.city = data.get("cidade")
        paciente.state = data.get("estado")
        paciente.zip_code = data.get("cep")
        paciente.education_level = data.get("escolaridade")
        paciente.race = data.get("raca_etnia")
        paciente.notes = data.get("situacao_outra_texto")

        if data.get("intern_id"):
            paciente.intern_id = int(data.get("intern_id"))
        if data.get("supervisor_id"):
            paciente.supervisor_id = int(data.get("supervisor_id"))

        if data.get("data_nascimento"):
            paciente.birthday = datetime.strptime(data["data_nascimento"], "%Y-%m-%d").date()

        if data.get("data_avaliacao"):
            paciente.evaluation_date = datetime.strptime(data["data_avaliacao"], "%Y-%m-%d").date()

        if data.get("data_alta"):
            paciente.discharge_date = datetime.strptime(data["data_alta"], "%Y-%m-%d").date()
        else:
            paciente.discharge_date = None

        db.session.commit()
        return jsonify({"success": True, "message": "Paciente atualizado com sucesso!"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)})

# GET FORM JSON
@main.route('/get_form_structure/<int:form_id>')
def get_form_structure(form_id):
    form_template = Form.query.get_or_404(form_id)
    if form_template and form_template.structure_json:
        return jsonify({
            "status": "success",
            "form_id": form_template.forms_id,
            "title": form_template.title,
            "structure_json": form_template.structure_json 
        })
    return jsonify({"status": "error", "message": "A estrutura desse formulário não foi encontrada"}), 404

@main.route('/excluir_form/<int:form_id>', methods=['POST'])
def excluir_form(form_id):
    form = Form.query.get_or_404(form_id)
    try:
        db.session.delete(form)
        db.session.commit()
        return redirect(url_for('main.lista_prontuarios'))
    except Exception as e:
        db.session.rollback()
        return f"Erro ao excluir formulário: {str(e)}", 500
