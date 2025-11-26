from flask import Blueprint, render_template, redirect, url_for, request, jsonify, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import json
from datetime import datetime
from app.database import db
from app.models import Paciente, User, Form, MedicalRecord
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
    forms_active = Form.query.filter_by(active=True).all()
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

        new_form = Form(
            title=form_name, 
            structure_json=form_structure_json,
            author_id=session.get('user_id'),
            created_at=datetime.utcnow()
        )
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

@main.route('/editar_form/<int:form_id>', methods=['GET'])
def editar_form(form_id):
    form = Form.query.get_or_404(form_id)
    return render_template(
        'criarprontuario.html',
        form_id=form.forms_id,
        title=form.title,
        structure_json=form.structure_json
    )

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
        form.updated_at = datetime.utcnow()
        form.updated_by_id = session.get('user_id')
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Formulário atualizado com sucesso!",
            "form_id": form.forms_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": f"Erro ao atualizar: {str(e)}"}), 500

@main.route('/novopaciente')
def novopaciente():
    supervisors = User.query.filter(User.type_user.in_(["admin", "supervisor"])).all()
    interns = User.query.filter_by(type_user="intern").all()

    return render_template(
        'novopaciente.html',
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

@main.route('/paciente/<int:id>')
def ver_paciente(id):
    paciente = Paciente.query.get_or_404(id)
    
    forms_disponiveis = Form.query.filter_by(active=True).all()
    
    historico = MedicalRecord.query.filter_by(patient_id=id).order_by(MedicalRecord.created_at.desc()).all()

    return render_template(
        'ver_paciente.html', 
        paciente=paciente, 
        forms_disponiveis=forms_disponiveis,
        historico=historico,
        now=datetime.now()
    )

@main.route('/salvar_atendimento/<int:patient_id>', methods=['POST'])
def salvar_atendimento(patient_id):
    data = request.get_json()
    
    if not data:
        return jsonify({"status": "error", "message": "Dados inválidos"}), 400

    try:
        form_id = data.get('form_id')
        record_data = data.get('record_data') # O JSON com as respostas
        
        # Pega o ID do usuário logado na sessão
        author_id = session.get('user_id')

        new_record = MedicalRecord(
            patient_id=patient_id,
            form_id=form_id,
            author_id=author_id,
            record_data=json.dumps(record_data), # Salva as respostas
            created_at=datetime.now()
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({"status": "success", "message": "Atendimento registrado com sucesso!"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@main.route('/get_medical_record/<int:record_id>')
def get_medical_record(record_id):
    # Busca o registro
    record = MedicalRecord.query.get_or_404(record_id)
    
    # Pega a estrutura do formulário original
    form_structure = record.form.structure_json
    
    # Pega os dados salvos (respostas)
    # Como salvamos como string JSON no banco, não precisamos de json.dumps aqui se for enviar direto,
    # mas o jsonify espera objetos Python, então vamos carregar a string para objeto se necessário.
    try:
        saved_data = json.loads(record.record_data)
    except:
        saved_data = record.record_data # Caso já esteja em formato compatível ou ocorra erro

    return jsonify({
        "status": "success",
        "structure": form_structure,
        "data": saved_data,
        "title": record.form.title,
        "date": record.created_at.strftime('%d/%m/%Y às %H:%M'),
        "author": record.author.name if record.author else "Desconhecido"
    })

@main.route('/atualizar_atendimento/<int:record_id>', methods=['POST'])
def atualizar_atendimento(record_id):
    try:
        record = MedicalRecord.query.get_or_404(record_id)
        data = request.get_json()

        if not data:
            return jsonify({"status": "error", "message": "Nenhum dado recebido"}), 400

        record_data = data.get('record_data')
        record.record_data = json.dumps(record_data)
        
        # --- SALVANDO INFORMAÇÕES DE EDIÇÃO ---
        record.updated_at = datetime.now() # Salva a hora atual
        record.updated_by_id = session.get('user_id') # Salva quem está logado agora
        
        db.session.commit()

        return jsonify({"status": "success", "message": "Prontuário atualizado com sucesso!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@main.route('/excluir_atendimento/<int:record_id>')
def excluir_atendimento(record_id):
    try:
        record = MedicalRecord.query.get_or_404(record_id)
        patient_id = record.patient_id # Salva ID para redirecionar depois
        
        db.session.delete(record)
        db.session.commit()
        
        flash("Atendimento excluído com sucesso!", "success")
        return redirect(url_for('main.ver_paciente', id=patient_id))
    except Exception as e:
        db.session.rollback()
        flash(f"Erro ao excluir: {str(e)}", "danger")
        return redirect(url_for('main.homepage'))

@main.route('/imprimir_paciente/<int:id>')
def imprimir_paciente(id):
    paciente = Paciente.query.get_or_404(id)

    records_db = MedicalRecord.query.filter_by(patient_id=id).order_by(MedicalRecord.created_at.desc()).all()

    records_processed = []
    
    for rec in records_db:
        try:
            structure = json.loads(rec.form.structure_json)
            data = json.loads(rec.record_data)
        except Exception as e:
            print(f"Erro ao fazer parse do JSON do record {rec.id}: {e}")
            structure = []
            data = {}

        records_processed.append({
            "id": rec.id,
            "title": rec.form.title,
            "date": rec.created_at.strftime('%d/%m/%Y às %H:%M'),
            "author": rec.author.name if rec.author else "Sistema",
            "updated_at": rec.updated_at.strftime('%d/%m/%Y às %H:%M') if rec.updated_at else None,
            "updated_by": rec.updated_by.name if rec.updated_by else None,
            "structure": structure, 
            "data": data         
        })

    return render_template(
        'imprimir_paciente.html', 
        paciente=paciente, 
        records=records_processed,
        now=datetime.now()
    )

# GET FORM JSON
@main.route('/get_form_structure/<int:form_id>')
def get_form_structure(form_id):
    try:
        form_template = Form.query.get_or_404(form_id)
        if form_template and form_template.structure_json:
            return jsonify({
                "status": "success",
                "form_id": form_template.forms_id,
                "title": form_template.title,
                "structure_json": form_template.structure_json 
            })
        return jsonify({"status": "error", "message": "A estrutura desse formulário não foi encontrada"}), 404
    except Exception as e:
        print(f"Erro em get_form_structure: {e}")
        return jsonify({"status": "error", "message": "Erro interno do servidor"}), 500

@main.route('/excluir_form/<int:form_id>', methods=['POST'])
def excluir_form(form_id):
    form = Form.query.get_or_404(form_id)
    try:
        tem_uso = MedicalRecord.query.filter_by(form_id=form_id).first()

        if tem_uso:
            form.active = False
            db.session.commit()
            flash("Formulário arquivado com sucesso! (Ele foi mantido no histórico pois já possui registros)", "warning")
        else:
            db.session.delete(form)
            db.session.commit()
            flash("Formulário excluído permanentemente.", "success")
            
        return redirect(url_for('main.lista_prontuarios'))

    except Exception as e:
        db.session.rollback()
        return f"Erro ao excluir formulário: {str(e)}", 500