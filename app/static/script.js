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

        // Habilitar/desabilitar e tornar obrigatório o campo de texto "Outra" para Situação Profissional
        const situacaoRadios = document.querySelectorAll('input[name="situacao_profissional"]');
        const situacaoOutraTexto = document.getElementById('situacao_outra_texto');
        situacaoRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.id === 'situacao_outra_radio' && this.checked) {
                    situacaoOutraTexto.disabled = false;
                    situacaoOutraTexto.required = true; // Torna obrigatório
                    situacaoOutraTexto.focus();
                } else {
                    situacaoOutraTexto.disabled = true;
                    situacaoOutraTexto.required = false; // Remove obrigatoriedade
                    situacaoOutraTexto.value = '';
                }
            });
        });

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

        const form = document.getElementById('novoPacienteForm');
        if (form) {
            form.addEventListener('submit', function(event) {
                if (document.getElementById('raca_outra_radio').checked && !racaOutraTexto.value.trim()) {
                    racaOutraTexto.focus();

                }

                if (document.getElementById('situacao_outra_radio').checked && !situacaoOutraTexto.value.trim()) {
                    situacaoOutraTexto.focus();

                }
            });
        }
    });

// Plugin FormBuilder (JQuery)
jQuery($ => {
    const options = {
        i18n: {
            override: {
                'en-US':
                {
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
                    size: 'Tamanho',
                    'size.xs': 'Extra Pequeno',
                    'size.sm': 'Pequeno',
                    'size.m': 'Padrão',
                    'size.lg': 'Grande',
                    style: 'Estilo',
                    styles: {
                        btn: {
                            'default': 'Padrão',
                            danger: 'Perigo',
                            info: 'Informação',
                            primary: 'Primário',
                            success: 'Sucesso',
                            warning: 'Aviso'
                        }
                    },
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
            'autocomplete',
            'button',
            'hidden',
            'paragraph',
            'text',
            'number',
            'textarea',
            'header',
            'file',
            'date',
            'checkbox-group',
            'radio-group',
            'select'
        ],
        controlOrder: [
            'header',
            'text',
            'textarea',
            'paragraph',
            'number',
            'checkbox-group',
            'date',
            'file',
            'radio-group',
            'Dropdown',
            'select',
        ],
        fields: [
            {
                label: 'Cabeçalho',
                type: 'header'
            },
            {
                label: 'Checkboxes',
                type: 'checkbox-group'
            },
            {
                label: 'Selecionar data',
                type: 'date'
            },
            {
                label: 'Upload de Arquivo',
                type: 'file'
            },
            {
                label: 'Número',
                type: 'number'
            },
            {
                label: 'Parágrafo',
                type: 'paragraph'
            },
            {
                label: 'Radios',
                type: 'radio-group'
            },
            {
                label: 'Dropdown',
                type: 'select'
            },
            {
                label: 'Campo de texto',
                type: 'text'
            },
            {
                label: 'Área de texto',
                type: 'textarea'
            }
        ],
        disabledAttrs: [
            'className', 'name', 'access', 'max', 'maxlength', 'min', 'value', 'step'
        ],
        disabledActionButtons: [
            'data'
        ],
        onSave: function (evt, formData) {
            const formName = $('#formName').val().trim();

            if (!formName) {
                alert('Por favor, preencha o nome do prontuário antes de salvar.');
                $('#formName').focus();
                // Para realmente impedir que o plugin considere a ação "salva"
                // você pode precisar explorar a documentação do plugin.
                // Lançar um erro pode ser uma opção se o plugin tratar isso.
                // Ou retornar um valor específico que o plugin interprete como falha.
                // Ex: throw new Error("Nome do prontuário é obrigatório.");
                // Por enquanto, `return false;` é uma tentativa comum de parar o processo.
                if (evt && typeof evt.preventDefault === 'function') {
                    evt.preventDefault(); // Tenta prevenir a ação padrão do plugin
                }
                return false; // Sinaliza que o salvamento não deve prosseguir
            }

            // Se o nome do prontuário estiver preenchido, prossiga com o salvamento:
            console.log('Nome do Prontuário (onSave):', formName);
            console.log('Dados do Formulário (JSON onSave):', formData);

            // Aqui você enviaria formName e formData para o seu backend Flask
            // Exemplo:
            // $.ajax({
            //     url: '/salvar_prontuario_route', // Sua rota Flask
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data: JSON.stringify({ name: formName, structure: formData }),
            //     success: function(response) {
            //         console.log('Prontuário salvo via FormBuilder!', response);
            //         alert('Prontuário salvo com sucesso!');
            //         // Opcional: Limpar campos ou redirecionar
            //         // fbInstance.actions.clearFields();
            //     },
            //     error: function(err) {
            //         console.error('Erro ao salvar prontuário via FormBuilder:', err);
            //         alert('Erro ao salvar prontuário.');
            //     }
            // });
        },
        scrollToFieldOnAdd: false,
        disabledSubtypes: {
            text: ['password', 'color'],
            number: ['range']
        },
        actionButtons: [{
            id: 'formBuilderPreviewBtn', 
            className: 'btn btn-secondary', 
            label: '<i class="bi bi-eye-fill"> Preview do formulário</i>',
            type: 'button',
            events: {
                click: function () {
                    const $previewContent = $('#previewContent');
                    const formData = fbInstance.actions.getData('json');
                    const formTitle = $('#formName').val().trim();

                    $previewContent.empty();

                    if (formTitle) {
                        const $titleElement = $('<h3>').addClass('text-center mb-3').text(formTitle);
                        $previewContent.append($titleElement);
                    } else {
                        const $titlePlaceholder = $('<h3>').addClass('text-center mb-3 text-muted').text('[Prontuário sem nome definido]');
                        $previewContent.append($titlePlaceholder);
                    }
                    
                    const $formRenderArea = $('<div>').attr('id', 'form-render-area');
                    $previewContent.append($formRenderArea);

                    if (formData && formData !== '[]') {
                        const renderOpts = { formData: formData };
                        $formRenderArea.formRender(renderOpts);
                    } else {
                        $formRenderArea.html('<p class="text-center text-muted mt-2">Nenhum campo adicionado ao formulário para pré-visualizar.</p>');
                    }

                    var previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
                    previewModal.show();
                }
            }
        }]
    };

    // Inicializa o FormBuilder e guarda a instância
    const fbInstance = $('.build-wrap').formBuilder(options);
});