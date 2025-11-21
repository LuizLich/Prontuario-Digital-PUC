/* Tables */
$(document).ready(function () {
    var table = $('#example').DataTable({
        responsive: true,
        language: {
            url: '/static/i18n/pt-BR.json'
        }
    });
});

$(document).ready(function () {
    var table = $('#example2').DataTable({
        responsive: true,
        language: {
            url: '/static/i18n/pt-BR.json'
        }
    });
});

// Active
document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
        const dropdown = link.closest('.dropdown');
        if (dropdown) {
            const parentLink = dropdown.querySelector('.nav-link.dropdown-toggle');
            if (parentLink) {
                parentLink.classList.add('active');
                parentLink.setAttribute('aria-current', 'page');
            }
        }
    }
});

// Forms
function togglePassword() {
    const input = document.getElementById("passwordInput");
    const icon = document.getElementById("eyeIcon");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    }
}

$(document).ready(function () {
    $('#supervisor_nome').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione o supervisor',
        allowClear: true
    });

    $('#estagiario_nome').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione o estagiário',
        allowClear: true
    });
});

// Novo paciente
document.addEventListener('DOMContentLoaded', function () {
    // Habilitar/desabilitar e tornar obrigatório o campo de texto "Outra" para Raça/Etnia
    const racaRadios = document.querySelectorAll('input[name="raca_etnia"]');
    const racaOutraTexto = document.getElementById('raca_outra_texto');
    if (racaRadios.length && racaOutraTexto) { // Adiciona verificação de existência
        racaRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.id === 'raca_outra_radio' && this.checked) {
                    racaOutraTexto.disabled = false;
                    racaOutraTexto.required = true;
                    racaOutraTexto.focus();
                } else {
                    racaOutraTexto.disabled = true;
                    racaOutraTexto.required = false;
                    racaOutraTexto.value = '';
                }
            });
        });
        // Checagem inicial
        const racaOutraRadioInitial = document.getElementById('raca_outra_radio');
        if (racaOutraRadioInitial && racaOutraRadioInitial.checked) {
            racaOutraTexto.disabled = false;
            racaOutraTexto.required = true;
        } else {
            racaOutraTexto.disabled = true;
            racaOutraTexto.required = false;
        }
    }


    // Habilitar/desabilitar e tornar obrigatório o campo de texto "Outra" para Situação Profissional
    const situacaoRadios = document.querySelectorAll('input[name="situacao_profissional"]');
    const situacaoOutraTexto = document.getElementById('situacao_outra_texto');
    if (situacaoRadios.length && situacaoOutraTexto) { // Adiciona verificação de existência
        situacaoRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.id === 'situacao_outra_radio' && this.checked) {
                    situacaoOutraTexto.disabled = false;
                    situacaoOutraTexto.required = true;
                    situacaoOutraTexto.focus();
                } else {
                    situacaoOutraTexto.disabled = true;
                    situacaoOutraTexto.required = false;
                    situacaoOutraTexto.value = '';
                }
            });
        });
        // Checagem inicial
        const situacaoOutraRadioInitial = document.getElementById('situacao_outra_radio');
        if (situacaoOutraRadioInitial && situacaoOutraRadioInitial.checked) {
            situacaoOutraTexto.disabled = false;
            situacaoOutraTexto.required = true;
        } else {
            situacaoOutraTexto.disabled = true;
            situacaoOutraTexto.required = false;
        }
    }

    // Validação básica no submit para os campos "Outra" (Vanilla JS)
    // O ID do formulário no HTML é 'formNovoPaciente', não 'novoPacienteForm'
    const formNovoPacienteVanilla = document.getElementById('formNovoPaciente');
    if (formNovoPacienteVanilla) {
        formNovoPacienteVanilla.addEventListener('submit', function (event) {
            // A validação de required=true já deve cuidar disso se o campo estiver habilitado
            // Mas podemos adicionar um foco extra se desejado.
            // Esta validação será complementada pela lógica de submissão jQuery abaixo.
            if (racaOutraTexto && !racaOutraTexto.disabled && !racaOutraTexto.value.trim()) {
                // event.preventDefault(); // A submissão jQuery abaixo já tem preventDefault()
                racaOutraTexto.focus();
                // alert('Por favor, preencha o campo "Outra" para Raça/Etnia.');
            }
            if (situacaoOutraTexto && !situacaoOutraTexto.disabled && !situacaoOutraTexto.value.trim()) {
                // event.preventDefault();
                situacaoOutraTexto.focus();
                // alert('Por favor, preencha o campo "Outra" para Situação Profissional.');
            }
        });
    }
});

const formNovo = document.getElementById("formNovoPaciente");
if (formNovo) {
    formNovo.addEventListener("submit", async function (event) {
        event.preventDefault();

        let supervisor_id = document.getElementById("supervisor_nome").value;
        let intern_id = document.getElementById("estagiario_nome").value;
        
        let prontuario_id = document.getElementById("prontuarioSelecionado")?.value;

        // --- NOVOS CAMPOS DE DATA ---
        let data_avaliacao = document.getElementById("data_avaliacao").value;
        let data_alta = document.getElementById("data_alta").value;

        let nome = document.getElementById("nome").value;
        let cpf = document.getElementById("cpf").value;
        let rg = document.getElementById("rg").value; // --- NOVO ---
        
        let data_nascimento = document.getElementById("data_nascimento").value;
        let celular = document.getElementById("celular").value;
        // Telefone foi removido
        let email = document.getElementById("email").value;

        let genero = document.querySelector("input[name='genero']:checked")?.value || null;
        let raca_etnia = document.querySelector("input[name='raca_etnia']:checked")?.value || null; 

        let situacao_profissional = document.querySelector("input[name='situacao_profissional']:checked")?.value || null;
        
        let estado_civil = document.getElementById("estado_civil").value;
        let escolaridade = document.getElementById("escolaridade").value;

        let endereco = document.getElementById("endereco").value;
        let bairro = document.getElementById("bairro")?.value;
        let cep = document.getElementById("cep")?.value;       // --- NOVO ---
        let cidade = document.getElementById("cidade").value; 
        let estado = document.getElementById("estado")?.value; // --- NOVO ---

        let situacao_outra_texto = document.getElementById("situacao_outra_texto")?.value || null;
        
        // Lógica para Raça "Outra"
        if (raca_etnia === "Outra") {
            let raca_texto = document.getElementById("raca_outra_texto")?.value;
            if(raca_texto) raca_etnia = raca_texto;
        }

        // Captura do Prontuário Dinâmico
        let prontuario_json = {};
        if ($('#renderedFormContainer').length) {
             $('#renderedFormContainer').find('input, select, textarea').each(function () {
                const name = $(this).attr('name');
                if (name) {
                    if ($(this).is(':radio') && !$(this).is(':checked')) return;
                    if ($(this).is(':checkbox')) {
                        if (!prontuario_json[name]) prontuario_json[name] = [];
                        if ($(this).is(':checked')) prontuario_json[name].push($(this).val());
                    } else {
                        prontuario_json[name] = $(this).val();
                    }
                }
            });
        }

        let payload = {
            supervisor_id,
            intern_id,
            prontuario_id,
            prontuario_json,
            
            data_avaliacao,
            data_alta,     
            
            nome,
            cpf,
            rg,             
            data_nascimento,
            celular,
            email,
            genero,
            raca_etnia, 
            estado_civil,
            escolaridade,
            situacao_profissional,
            endereco,
            bairro,
            cep,            
            cidade, 
            estado,        
            situacao_outra_texto
        };

        try {
            const response = await fetch("/salvarpaciente", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();

            if (result.success) {
                alert("Paciente salvo com sucesso!");
                window.location.href = "/pacientes";
            } else {
                alert("Erro: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Erro na requisição.");
        }
    });
}

const formEditar = document.getElementById("formEditarPaciente");
if (formEditar) {
    formEditar.addEventListener("submit", async function (event) {
        event.preventDefault();

        const paciente_id = document.getElementById("paciente_id").value;

        let payload = {
            supervisor_id: document.getElementById("supervisor_nome").value,
            intern_id: document.getElementById("estagiario_nome").value,

            data_avaliacao: document.getElementById("data_avaliacao").value,
            data_alta: document.getElementById("data_alta").value,

            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            rg: document.getElementById("rg").value,

            data_nascimento: document.getElementById("data_nascimento").value,
            celular: document.getElementById("celular").value,
            email: document.getElementById("email").value,

            genero: document.querySelector("input[name='genero']:checked")?.value,
            estado_civil: document.getElementById("estado_civil").value,
            escolaridade: document.getElementById("escolaridade").value,

            endereco: document.getElementById("endereco").value,
            bairro: document.getElementById("bairro").value,
            cep: document.getElementById("cep").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,

            raca_etnia: document.querySelector("input[name='raca_etnia']:checked")?.value,
            situacao_profissional: document.querySelector("input[name='situacao_profissional']:checked")?.value,
            situacao_outra_texto: document.getElementById("situacao_outra_texto").value
        };

        // Raça "Outra"
        if (payload.raca_etnia === "Outra") {
            payload.raca_etnia = document.getElementById("raca_outra_texto").value;
        }

        // Profissão "Outra"
        if (payload.situacao_profissional === "Outra") {
            payload.situacao_profissional = document.getElementById("situacao_outra_texto").value;
        }

        try {
            const response = await fetch(`/atualizar_paciente/${paciente_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert("Paciente atualizado com sucesso!");
                window.location.href = "/pacientes";
            } else {
                alert("Erro: " + result.message);
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao enviar dados.");
        }
    });
}

// Lógica jQuery FormBuilder
jQuery($ => {
    if ($('.build-wrap').length) {
        const options = {
            i18n: {
                override: {
                    'en-US': {
                        addOption: 'Adicionar Opção +',
                        allFieldsRemoved: 'Todos os campos foram removidos.',
                        allowMultipleFiles: 'Permitir múltiplos arquivos',
                        autocomplete: 'Autocompletar',
                        button: 'Botão',
                        cannotBeEmpty: 'Este campo não pode estar vazio',
                        checkboxGroup: 'Checkboxes',
                        className: 'Classe',
                        clearAllMessage: 'Tem certeza que deseja limpar todos os campos?',
                        clear: 'Limpar todos os itens',
                        close: 'Fechar',
                        content: 'Conteúdo',
                        copy: 'Copiar',
                        copyButton: '&#43;',
                        copyButtonTooltip: 'Copiar',
                        dateField: 'Selecionar data',
                        description: 'Texto de Ajuda',
                        descriptionField: 'Descrição',
                        devMode: 'Modo Desenvolvedor',
                        editNames: 'Editar Nomes',
                        editorTitle: 'Elementos do Formulário',
                        editXML: 'Editar XML',
                        enableOther: 'Habilitar "Outro"',
                        enableOtherMsg: 'Permitir opções não listadas',
                        fieldNonEditable: 'Este campo não pode ser editado.',
                        fieldRemoveWarning: 'Tem certeza que deseja remover este campo?',
                        fileUpload: 'Upload de Arquivo',
                        formUpdated: 'Formulário Atualizado',
                        getStarted: 'Arraste um campo da direita para esta área',
                        header: 'Cabeçalho',
                        hide: 'Editar',
                        hidden: 'Campo Oculto',
                        inline: 'Em linha',
                        inlineDesc: 'Mostrar {type} em linha',
                        label: 'Rótulo',
                        labelEmpty: 'O rótulo do campo não pode estar vazio',
                        limitRole: 'Limitar acesso a papéis',
                        mandatory: 'Obrigatório',
                        maxlength: 'Tamanho Máximo',
                        minOptionMessage: 'Este campo requer no mínimo 2 opções',
                        multipleFiles: 'Múltiplos Arquivos',
                        name: 'Nome',
                        no: 'Não',
                        noFieldsToClear: 'Não há campos para limpar',
                        number: 'Número',
                        off: 'Desligado',
                        on: 'Ligado',
                        option: 'Opção',
                        options: 'Opções',
                        optional: 'opcional',
                        optionLabelPlaceholder: 'Rótulo',
                        optionValuePlaceholder: 'Valor',
                        optionEmpty: 'Valor da opção é obrigatório',
                        other: 'Outro',
                        paragraph: 'Parágrafo',
                        placeholder: 'Placeholder',
                        'placeholder.email': 'Digite seu email',
                        'placeholder.password': 'Digite sua senha',
                        preview: 'Pré-visualizar',
                        radioGroup: 'Radios',
                        radio: 'Radio',
                        removeMessage: 'Remover Elemento',
                        removeOption: 'Remover Opção',
                        remove: '&#215;',
                        required: 'Obrigatório',
                        richText: 'Editor de Texto Rico',
                        roles: 'Acesso',
                        rows: 'Linhas',
                        save: 'Salvar',
                        selectOptions: 'Opções',
                        select: 'Dropdown',
                        selectColor: 'Selecionar Cor',
                        selectionsMessage: 'Permitir múltiplas seleções',
                        size: 'Tamanho',
                        'size.xs': 'Extra Pequeno',
                        'size.sm': 'Pequeno',
                        'size.m': 'Padrão',
                        'size.lg': 'Grande',
                        style: 'Estilo',
                        subtype: 'Tipo',
                        text: 'Campo de Texto',
                        textArea: 'Área de Texto',
                        toggle: 'Alternar',
                        warning: 'Aviso!',
                        value: 'Valor',
                        viewJSON: '{  }',
                        viewXML: '&lt;/&gt;',
                        time: 'Hora',
                        yes: 'Sim'
                    }
                }
            },
            disableFields: ['autocomplete', 'button', 'hidden'],
            disabledAttrs: ['className', 'name', 'access', 'max', 'maxlength', 'min', 'value', 'step'],
            disabledActionButtons: ['data', 'save'],
            scrollToFieldOnAdd: false,
            onSave: function (evt, formData) {
                const formName = $('#formName').val().trim();
                if (!formName) {
                    alert('Por favor, preencha o nome do prontuário antes de salvar.');
                    $('#formName').focus();
                    evt.preventDefault();
                    return false;
                }

                const formId = $('#formId').val();
                const url = formId ? `/atualizar_formulario/${formId}` : '/salvar_formulario';

                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ name: formName, structure: formData }),
                    success: function (response) {
                        alert(response.message || 'Formulário salvo com sucesso!');
                        if (!formId) {
                            window.location.href = '/lista_prontuarios';
                        }
                    },
                    error: function (jqXHR) {
                        console.error("Erro ao salvar formulário:", jqXHR.responseText);
                        alert("Erro ao salvar o formulário.");
                    }
                });
            },
            actionButtons: [
                {
                    id: 'formBuilderPreviewBtn',
                    className: 'btn btn-secondary',
                    label: '<i class="bi bi-eye-fill"></i> Preview',
                    type: 'button',
                    events: {
                        click: function () {
                            const $previewContent = $('#previewContent');
                            const formData = fbInstance.actions.getData('json');
                            const formTitle = $('#formName').val().trim();
                            $previewContent.empty();

                            $previewContent.append(
                                $('<h3>').addClass('text-center mb-3').text(formTitle || '[Prontuário sem nome]')
                            );

                            const $formRenderArea = $('<div id="form-render-area-modal">');
                            $previewContent.append($formRenderArea);

                            if (formData && formData !== '[]') {
                                $formRenderArea.formRender({ formData });
                            } else {
                                $formRenderArea.html('<p class="text-center text-muted">Nenhum campo adicionado.</p>');
                            }

                            new bootstrap.Modal(document.getElementById('previewModal')).show();
                        }
                    }
                },
                {
                    id: 'saveDataBtn',
                    className: 'btn btn-primary',
                    label: '<i class="bi bi-save-fill"></i> Salvar',
                    type: 'button',
                    events: {
                        click: function (evt) {
                            options.onSave(evt, fbInstance.actions.getData('json'));
                        }
                    }
                }
            ]
        };

        const fbInstance = $('.build-wrap').formBuilder(options);
        // Se estiver editando um formulário existente, carrega dados
        const formId = $('#formId').val();
        if (formId) {
            $.ajax({
                url: `/get_form_structure/${formId}`,
                method: 'GET',
                success: function (response) {
                    if (response.status === "success") {
                        fbInstance.actions.setData(response.structure_json);
                        $('#formName').val(response.title);
                    }
                }
            });
        }
    }

    // Renderização do Prontuário no Novo Paciente
    const $formNovoPaciente = $('#formNovoPaciente');
    const $prontuarioDropdown = $('#prontuarioSelecionado');

    if ($formNovoPaciente.length && $prontuarioDropdown.length) {
        const $renderedFormContainer = $('#renderedFormContainer');
        const $renderedFormTitleContainer = $('#renderedFormTitleContainer');
        const $renderedFormTitleText = $('#renderedFormTitleText');

        $prontuarioDropdown.on('change', function () {
            const formId = $(this).val();
            const selectedText = $(this).find('option:selected').text();

            $renderedFormContainer.empty().hide();
            $renderedFormTitleText.empty();
            $renderedFormTitleContainer.hide();

            if (formId) {
                const loading = `
                    <div class="text-center py-3">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2">Carregando formulário...</p>
                    </div>`;
                $renderedFormContainer.html(loading).show();

                $.ajax({
                    url: `/get_form_structure/${formId}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        $renderedFormContainer.empty();
                        if (response.status === 'success' && response.structure_json) {
                            $renderedFormTitleText.text(response.title || selectedText);
                            $renderedFormTitleContainer.show();
                            $renderedFormContainer.formRender({ formData: response.structure_json }).show();
                        } else {
                            $renderedFormContainer.html('<p class="text-danger">Erro ao carregar formulário.</p>');
                        }
                    },
                    error: function () {
                        $renderedFormContainer.html('<p class="text-danger">Falha na comunicação com o servidor.</p>');
                    }
                });
            }
        });

        $formNovoPaciente.on('submit', function (event) {
            event.preventDefault();

            const identificacaoData = {};
            $(this).find('input, select, textarea').each(function () {
                const name = $(this).attr('name');
                if (name && !name.startsWith("renderedForm")) {
                    if ($(this).is(':radio') && !$(this).is(':checked')) return;
                    if ($(this).is(':checkbox')) {
                        identificacaoData[name] = $(this).is(':checked');
                    } else {
                        identificacaoData[name] = $(this).val();
                    }
                }
            });
            identificacaoData['prontuario_template_id'] = $prontuarioDropdown.val();

            const prontuarioRespostas = {};
            $('#renderedFormContainer').find('input, select, textarea').each(function () {
                const name = $(this).attr('name');
                if (name) {
                    if ($(this).is(':radio') && !$(this).is(':checked')) return;
                    if ($(this).is(':checkbox')) {
                        if (!prontuarioRespostas[name]) prontuarioRespostas[name] = [];
                        if ($(this).is(':checked')) prontuarioRespostas[name].push($(this).val());
                    } else {
                        prontuarioRespostas[name] = $(this).val();
                    }
                }
            });

            const payload = {
                identificacao: identificacaoData,
                prontuario_respostas: prontuarioRespostas,
                form_template_id: $prontuarioDropdown.val()
            };

            console.log("Dados completos:", payload);

            // Aqui você pode ativar a chamada AJAX real:
            /*
            $.ajax({
                url: '/salvar_paciente_com_prontuario',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (response) {
                    alert(response.message || 'Salvo com sucesso!');
                    window.location.href = '/lista_pacientes';
                },
                error: function (jqXHR) {
                    alert("Erro ao salvar: " + (jqXHR.responseJSON?.message || jqXHR.responseText));
                }
            });
            */
        });
    }
});

function previewForm(formId, title) {
    const $previewContent = $('#previewContent');
    $previewContent.empty();

    $.get(`/get_form_structure/${formId}`, function (data) {
        if (data.status === "success") {
            $previewContent.append(
                $('<h3>').addClass('text-center mb-3').text(title || '[Prontuário sem nome]')
            );

            const $formRenderArea = $('<div id="form-render-area-modal">');
            $previewContent.append($formRenderArea);

            if (data.structure_json && data.structure_json !== '[]') {
                $formRenderArea.formRender({ formData: data.structure_json });
            } else {
                $formRenderArea.html('<p class="text-center text-muted">Nenhum campo adicionado.</p>');
            }

            new bootstrap.Modal(document.getElementById('previewModal')).show();
        } else {
            alert("Erro ao carregar o formulário.");
        }
    });
}