/* Tables */
$(document).ready(function () {
    var table = $('#example').DataTable({
        responsive: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
        }
    });
});

$(document).ready(function () {
    var table = $('#example2').DataTable({
        responsive: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
        }
    });
});

/* Active */
document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(link => {
    if (link.href === window.location.href) {
        link.setAttribute('aria-current', 'page');

        const dropdown = link.closest('.dropdown');
        if (dropdown) {
            const parentLink = dropdown.querySelector('.nav-link.dropdown-toggle');
            if (parentLink) {
                parentLink.setAttribute('aria-current', 'page');
            }
        }
    }
});

document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
    if (link.href === window.location.href) {
        link.setAttribute('aria-current', 'page');
    }
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

    // Calcular idade automaticamente a partir da data de nascimento
    const dataNascimentoInput = document.getElementById('data_nascimento');
    const idadeInput = document.getElementById('idade');

    if (dataNascimentoInput && idadeInput) {
        dataNascimentoInput.addEventListener('change', function () {
            if (this.value) {
                const hoje = new Date();
                const nascimento = new Date(this.value);
                let idade = hoje.getFullYear() - nascimento.getFullYear();
                const mes = hoje.getMonth() - nascimento.getMonth();
                if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
                    idade--;
                }
                idadeInput.value = idade >= 0 ? idade : '';
            } else {
                idadeInput.value = '';
            }
        });
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

// Lógica jQuery (FormBuilder e Nova Lógica para novopaciente.html)
// Novo paciente (Vanilla JS - Bloco existente, com pequenas melhorias de verificação)
document.addEventListener('DOMContentLoaded', function () {
    // Habilitar/desabilitar e tornar obrigatório o campo de texto "Outra" para Raça/Etnia
    const racaRadios = document.querySelectorAll('input[name="raca_etnia"]');
    const racaOutraTexto = document.getElementById('raca_outra_texto');

    if (racaRadios.length > 0 && racaOutraTexto) { // Verifica se os elementos existem
        const racaOutraRadio = document.getElementById('raca_outra_radio');
        racaRadios.forEach(radio => {
            radio.addEventListener('change', function() {
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
        // Checagem inicial para o caso da página ser recarregada com "Outra" selecionado
        if (racaOutraRadio && racaOutraRadio.checked) {
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
    if (situacaoRadios.length > 0 && situacaoOutraTexto) { // Verifica se os elementos existem
        const situacaoOutraRadio = document.getElementById('situacao_outra_radio');
        situacaoRadios.forEach(radio => {
            radio.addEventListener('change', function() {
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
        if (situacaoOutraRadio && situacaoOutraRadio.checked) {
            situacaoOutraTexto.disabled = false;
            situacaoOutraTexto.required = true;
        } else {
            situacaoOutraTexto.disabled = true;
            situacaoOutraTexto.required = false;
        }
    }

    // Calcular idade automaticamente a partir da data de nascimento
    const dataNascimentoInput = document.getElementById('data_nascimento');
    const idadeInput = document.getElementById('idade');

    if (dataNascimentoInput && idadeInput) {
        dataNascimentoInput.addEventListener('change', function() {
            if (this.value) {
                const hoje = new Date();
                const nascimento = new Date(this.value);
                let idade = hoje.getFullYear() - nascimento.getFullYear();
                const mes = hoje.getMonth() - nascimento.getMonth();
                if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
                    idade--;
                }
                idadeInput.value = idade >= 0 ? idade : '';
            } else {
                idadeInput.value = '';
            }
        });
    }

    // Validação básica no submit para os campos "Outra" (Vanilla JS)
    // O ID do formulário no HTML é 'formNovoPaciente'
    const formNovoPacienteVanilla = document.getElementById('formNovoPaciente'); 
    if (formNovoPacienteVanilla) {
        formNovoPacienteVanilla.addEventListener('submit', function(event) {
            // A validação HTML5 com 'required' já deve tratar isso.
            // O preventDefault será chamado pela lógica jQuery de submissão AJAX.
            if (racaOutraTexto && !racaOutraTexto.disabled && !racaOutraTexto.value.trim()) {
                racaOutraTexto.focus();
            }
            if (situacaoOutraTexto && !situacaoOutraTexto.disabled && !situacaoOutraTexto.value.trim()) {
                situacaoOutraTexto.focus();
            }
        });
    }
});

// Lógica jQuery
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
                        limitRole: 'Limitar acesso a um ou mais dos seguintes papéis:',
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
                        'placeholder.value': 'Valor', 
                        'placeholder.label': 'Rótulo',
                        'placeholder.text': '', 
                        'placeholder.textarea': '', 
                        'placeholder.email': 'Digite seu email',
                        'placeholder.placeholder': '', 
                        'placeholder.className': 'classes separadas por espaço',
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
                        size: 'Tamanho', 'size.xs': 'Extra Pequeno',
                        'size.sm': 'Pequeno', 'size.m': 'Padrão', 'size.lg': 'Grande', 
                        style: 'Estilo',
                        styles: 
                        { btn: { 'default': 'Padrão', danger: 'Perigo', info: 'Informação', primary: 'Primário', success: 'Sucesso', warning: 'Aviso' } },
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
            disableFields: [
                'autocomplete', 'button', 'hidden', 'paragraph', 'text', 'number', 'textarea', 'header',
                'file', 'date', 'checkbox-group', 'radio-group', 'select'
            ],
            controlOrder: [
                'header', 'text', 'textarea', 'paragraph', 'number', 'checkbox-group',
                'date', 'file', 'radio-group', 'Dropdown', 'select',
            ],
            fields: [
                { label: 'Cabeçalho', type: 'header' }, 
                { label: 'Checkboxes', type: 'checkbox-group' },
                { label: 'Selecionar data', type: 'date' }, 
                { label: 'Upload de Arquivo', type: 'file' },
                { label: 'Número', type: 'number' }, 
                { label: 'Parágrafo', type: 'paragraph' },
                { label: 'Radios', type: 'radio-group' }, 
                { label: 'Dropdown', type: 'select' },
                { label: 'Campo de texto', type: 'text' }, 
                { label: 'Área de texto', type: 'textarea' }
            ],
            disabledAttrs: [
                'className', 'name', 'access', 'max', 'maxlength', 'min', 'value', 'step'
            ],
            disabledActionButtons: ['data', 'save'],
            scrollToFieldOnAdd: false,
            disabledSubtypes: {
                text: ['password', 'color'],
                number: ['range']
            },
            onSave: function (evt, formData) {
                const formName = $('#formName').val().trim();
                if (!formName) {
                    alert('Por favor, preencha o nome do prontuário antes de salvar.');
                    $('#formName').focus();
                    if (evt && typeof evt.preventDefault === 'function') {
                        evt.preventDefault();
                    }
                    return false;
                }
                console.log('Nome do Prontuário (onSave):', formName);
                console.log('Dados do Formulário (JSON onSave):', formData);
                $.ajax({
                    url: '/salvar_formulario',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ name: formName, structure: formData }),
                    success: function(response) {
                        console.log('Resposta do servidor:', response);
                        alert(response.message || 'Formulário salvo com sucesso!');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('Erro ao salvar formulário:', textStatus, errorThrown, jqXHR.responseText);
                        let errorMessage = 'Erro ao salvar o formulário.';
                        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                            errorMessage = jqXHR.responseJSON.message;
                        } else if (jqXHR.responseText) {
                            try {
                                const errData = JSON.parse(jqXHR.responseText);
                                if(errData && errData.message) errorMessage = errData.message;
                            } catch(e) { /* não faz nada se não for JSON */ }
                        }
                        alert(errorMessage);
                    }
                });
            },
            actionButtons: [{
                id: 'formBuilderPreviewBtn', 
                className: 'btn btn-secondary', 
                label: '<i class="bi bi-eye-fill"> Preview do formulário</i>',
                type: 'button',
                events: {
                    click: function () {
                        const $previewContent = $('#previewContent'); // Modal de preview
                        const formData = fbInstance.actions.getData('json');
                        const formTitle = $('#formName').val().trim(); 
                        $previewContent.empty();
                        if (formTitle) {
                            $previewContent.append($('<h3>').addClass('text-center mb-3').text(formTitle));
                        } else {
                            $previewContent.append($('<h3>').addClass('text-center mb-3 text-muted').text('[Prontuário sem nome definido]'));
                        }
                        const $formRenderArea = $('<div>').attr('id', 'form-render-area-modal'); // ID único para o container do modal
                        $previewContent.append($formRenderArea);
                        if (formData && formData !== '[]') {
                            $formRenderArea.formRender({ formData: formData }); 
                        } else {
                            $formRenderArea.html('<p class="text-center text-muted mt-2">Nenhum campo adicionado ao formulário para pré-visualizar.</p>');
                        }
                        var previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
                        previewModal.show();
                    }
                }
            },
            {
                id: 'saveDataBtn', 
                className: 'btn btn-primary save-template',
                label: '<i class="bi bi-save-fill me-2"> Salvar</i>',
                type: 'button',
                events: {
                    click: function (evt) { 
                        if (options.onSave && typeof options.onSave === 'function') {
                            options.onSave(evt, fbInstance.actions.getData('json')); 
                        } else {
                            console.warn('Função options.onSave não encontrada para o botão Salvar.');
                        }
                    }
                }
            }]
        };
        const fbInstance = $('.build-wrap').formBuilder(options);
    }

    const $formNovoPaciente = $('#formNovoPaciente'); // Form principal da página novopaciente.html
    const $prontuarioDropdown = $('#prontuarioSelecionado'); // Dropdown de seleção de prontuário

    if ($formNovoPaciente.length && $prontuarioDropdown.length) {

        const $renderedFormContainer = $('#renderedFormContainer');
        const $renderedFormTitleContainer = $('#renderedFormTitleContainer');
        const $renderedFormTitleText = $('#renderedFormTitleText');

        $prontuarioDropdown.on('change', function() {
            const formId = $(this).val();
            const selectedOptionText = $(this).find('option:selected').text();

            $renderedFormContainer.empty().hide();
            $renderedFormTitleText.empty();
            $renderedFormTitleContainer.hide();

            if (formId && formId !== "") {
                const $loadingPlaceholder = $(
                    '<div class="text-center py-3">' +
                        '<div class="spinner-border text-primary" role="status">' +
                            '<span class="visually-hidden">Carregando formulário...</span>' +
                        '</div>' +
                        '<p class="mt-2">Carregando formulário...</p>' +
                    '</div>'
                );
                $renderedFormContainer.append($loadingPlaceholder).show();

                $.ajax({
                    url: `/get_form_structure/${formId}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        $loadingPlaceholder.remove();
                        if (response.status === 'success' && response.structure_json) {
                            try {
                                // formRender espera o JSON
                                // A resposta do servidor já tem structure_json como string JSON
                                const formDataToRender = response.structure_json; 
                                
                                $renderedFormTitleText.text(response.title || selectedOptionText);
                                $renderedFormTitleContainer.show();
                                
                                $renderedFormContainer.formRender({ formData: formDataToRender });
                                $renderedFormContainer.show();
                            } catch (e) {
                                console.error("Erro ao processar JSON da estrutura do formulário:", e, response.structure_json);
                                $renderedFormContainer.html('<p class="text-danger">Erro ao processar a estrutura do formulário.</p>');
                            }
                        } else {
                            console.error("Erro ao buscar estrutura do formulário:", response.message);
                            $renderedFormContainer.html(`<p class="text-danger">${response.message || 'Não foi possível carregar a estrutura do formulário.'}</p>`);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $loadingPlaceholder.remove();
                        console.error('Erro AJAX ao buscar formulário:', textStatus, errorThrown, jqXHR.responseText);
                        $renderedFormContainer.html('<p class="text-danger">Erro de comunicação ao buscar o formulário. Tente novamente.</p>');
                    }
                });
            }
        });

        $formNovoPaciente.on('submit', function(event) {
            event.preventDefault(); 

            const identificacaoData = {};
            $(this).find('input:not([name^="renderedForm"]), select:not(#prontuarioSelecionado), textarea').each(function() {
                const name = $(this).attr('name');
                if (name) {
                    if ($(this).is(':radio')) {
                        if ($(this).is(':checked')) {
                            identificacaoData[name] = $(this).val();
                        }
                    } else if ($(this).is(':checkbox')) {
                        identificacaoData[name] = $(this).is(':checked');
                    } else {
                        identificacaoData[name] = $(this).val();
                    }
                }
            });
            identificacaoData['prontuario_template_id'] = $prontuarioDropdown.val(); 

            console.log("Dados de Identificação Coletados:", identificacaoData);

            const prontuarioRenderizadoData = {};
            $('#renderedFormContainer').find('input, select, textarea').each(function() {
                const name = $(this).attr('name');
                if (name) { 
                    if ($(this).is(':radio')) {
                        if ($(this).is(':checked')) {
                            prontuarioRenderizadoData[name] = $(this).val();
                        }
                    } else if ($(this).is(':checkbox')) {
                        // Coleta de múltiplos checkboxes
                        if (!prontuarioRenderizadoData[name]) {
                            prontuarioRenderizadoData[name] = [];
                        }
                        if ($(this).is(':checked')) {
                            prontuarioRenderizadoData[name].push($(this).val());
                        }
                    } else {
                        prontuarioRenderizadoData[name] = $(this).val();
                    }
                }
            });
            // Se nenhum checkbox de um grupo for marcado, a array pode ficar vazia.
            // Remover chaves com arrays vazias se necessário para o backend
            for (const key in prontuarioRenderizadoData) {
                if (Array.isArray(prontuarioRenderizadoData[key]) && prontuarioRenderizadoData[key].length === 0) {
                    // delete prontuarioRenderizadoData[key];
                }
            }
            console.log("Dados do Prontuário Renderizado Coletados:", prontuarioRenderizadoData);

            const dadosCompletosParaSalvar = {
                identificacao: identificacaoData,
                prontuario_respostas: prontuarioRenderizadoData,
                form_template_id: $prontuarioDropdown.val() // ID do template de formulário usado
            };

            // TODO: Implementar a chamada AJAX para a nova rota Flask que salvará esses dados
            // Exemplo da chamada AJAX:
            /*
            $.ajax({
                url: '/salvar_paciente_com_prontuario', // Defina esta rota no seu views.py
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dadosCompletosParaSalvar),
                success: function(response) {
                    alert(response.message || 'Paciente e prontuário salvos com sucesso!');
                    $formNovoPaciente[0].reset(); 
                    $renderedFormContainer.empty().hide(); 
                    $renderedFormTitleText.empty();
                    $renderedFormTitleContainer.hide();
                    $prontuarioDropdown.val(''); 
                    // window.location.href = '/pagina_de_sucesso_ou_lista_pacientes';
                },
                error: function(jqXHR) {
                    let errorMsg = 'Erro ao salvar os dados do paciente e prontuário.';
                    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                        errorMsg = jqXHR.responseJSON.message;
                    } else {
                        errorMsg = jqXHR.responseText || errorMsg; // fallback para responseText
                    }
                    alert(errorMsg);
                    console.error("Erro ao salvar paciente com prontuário:", jqXHR.responseText);
                }
            });
            */
            alert("Submissão AJAX interceptada (para demonstração)! Verifique o console para os 'dadosCompletosParaSalvar'. A lógica de envio para o backend precisa ser implementada na chamada AJAX comentada.");
        });
    }
});