// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Recupera a lista de tarefas do localStorage, ou inicializa uma lista vazia se não houver dados
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    // Função para salvar a lista de tarefas no localStorage
    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // Função para exibir um formulário específico baseado no ID fornecido
    function showForm(formId) {
        // Seleciona todos os formulários
        const forms = document.querySelectorAll('.form-container');
        // Esconde todos os formulários
        forms.forEach(form => form.style.display = 'none');
        // Mostra o formulário específico baseado no ID
        const formToShow = document.getElementById(`form-${formId}`);
        if (formToShow) {
            formToShow.style.display = 'block';
        }
        // Esconde o container da lista de Tarefas
        document.getElementById('list-container').style.display = 'none';

        // Se o formulário for o de apagar, exibe os Tarefas para apagar
        if (formId === 'apagar') {
            exibirTarefasParaApagar();
        }
    }

    // Função para cadastrar um Tarefa
    function cadastrarTarefa() {
        // Obtém os valores dos campos de entrada do formulário
        const title = document.getElementById('titulo').value;
        const date = document.getElementById('data').value;
        const done = 'Pendente';

        // Verifica se o campo título está preenchido
        if (title) {
            // Verifica se o campo data está preenchido
            if (date) {
                // Adiciona a Tarefa à lista de Tarefas
                tarefas.push({ title, date, done });
                salvarTarefas();
                alert('Tarefa cadastrada com sucesso!');
                // Limpa os campos do formulário
                document.getElementById('titulo').value = '';
                document.getElementById('data').value = '';
            } else {
                alert('Por favor, preencha a data de conclusão.');
            }
                if (!date) {
                    // Obtém a data atual
                    const today = new Date().toISOString().split('T')[0];
                    // Verifica se a data é anterior à data atual
                    if (date < today) {
                        alert('A data deve ser a partir de hoje.');
                        return; // Encerra a função se a data for anterior a hoje
                    }
                }
        } else {
            alert('Por favor, preencha o título do Tarefa.');
        }
    }

    // Função para exibir a lista de Tarefas cadastrados
    function showTasks() {
        const listContainer = document.getElementById('list-container');
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        // Adiciona cada Tarefa da lista de Tarefas ao elemento de lista na página
        tarefas.forEach(tarefa => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div>
                    <p>Título: ${tarefa.title}</p>
                    <p>Data de conclusão: ${tarefa.date}</p>
                    <p>Data de conclusão: ${tarefa.done}</p>
                </div>
            `;
            taskList.appendChild(listItem);
        });

        // Exibe o container da lista de Tarefas
        listContainer.style.display = 'block';
    }

    // Função para exibir os Tarefas a serem apagados com checkboxes
    function exibirTarefasParaApagar() {
        const apagarList = document.getElementById('apagar-list');
        apagarList.innerHTML = '';

        // Adiciona cada Tarefa da lista de Tarefas ao elemento de lista para apagar na página
        tarefas.forEach((tarefa, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" id="apagar-${index}" data-index="${index}">
                <label for="apagar-${index}">${tarefa.title} - ${tarefa.date}</label>
            `;
            apagarList.appendChild(listItem);
        });

        const selectAllCheckbox = document.getElementById('select-all');
        selectAllCheckbox.checked = false;
        // Adiciona um evento para selecionar ou desmarcar todos os checkboxes
        selectAllCheckbox.addEventListener('change', () => {
            const checkboxes = document.querySelectorAll('#apagar-list input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
        });
    }

    // Função para apagar os Tarefas selecionados
    function apagarTarefas() {
        // Seleciona todos os checkboxes que estão marcados
        const checkboxes = document.querySelectorAll('#apagar-list input[type="checkbox"]:checked');
        if (checkboxes.length > 0) {
            // Obtém os índices dos Tarefas a serem apagados
            const indicesParaApagar = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index));
            // Filtra a lista de Tarefas, removendo os Tarefas que estão marcados para apagar
            tarefas = tarefas.filter((_, index) => !indicesParaApagar.includes(index));
            salvarTarefas();
            alert('Tarefa(s) apagado(s) com sucesso!');
            // Atualiza a lista de Tarefas a serem apagados
            exibirTarefasParaApagar();
        } else {
            alert('Por favor, selecione pelo menos um Tarefa para apagar.');
        }
    }

    // Adiciona eventos aos botões do menu
    document.getElementById('btn-cadastrar').addEventListener('click', () => showForm('cadastrar'));

    // Recarrega a página ao clicar em "Listar Tarefas" para exibir a lista de Tarefas
    document.getElementById('btn-listar').addEventListener('click', () => {
        localStorage.setItem('listTasks', 'true');
        location.reload();
    });

    document.getElementById('btn-apagar').addEventListener('click', () => showForm('apagar'));

    // Adiciona eventos aos botões de submissão dos formulários
    document.getElementById('btn-submit-cadastrar').addEventListener('click', cadastrarTarefa);
    document.getElementById('btn-submit-apagar').addEventListener('click', apagarTarefas);

    // Verifica se a página foi recarregada para listar os Tarefas
    if (localStorage.getItem('listTasks') === 'true') {
        showTasks();
        localStorage.removeItem('listTasks');
    }
});
