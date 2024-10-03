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
        const formToShow = document.getElementById(form-${formId});
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

        const create = new Date();
        const edited = create.toLocaleDateString('pt-BR');

        // Define o status da Tarefa como pendente por padrão
        const done = 'Pendente';

        // Verifica se o campo título está preenchido
        if (title) {

            // Verifica se o campo data está preenchido
            if (date) {

                // Obtém a data atual
                    const today = new Date().toISOString().split('T')[0];

                    // Verifica se a data é anterior à data atual
                    if (date < today) {
                        alert('A data deve ser a partir de hoje.');
                        return; // Encerra a função se a data for anterior a hoje
                    }
                    // Converte a data para o formato brasileiro
                    const taskDate = new Date(date + 'T00:00:00'); // Adiciona 'T00:00:00' para evitar problemas de fuso horário
                    const formattedDate = taskDate.toLocaleDateString('pt-BR');

                // Adiciona a Tarefa à lista de Tarefas
                tarefas.push({ title, date: formattedDate, done, edited });
                salvarTarefas();
                alert('Tarefa cadastrada com sucesso!');

                // Limpa os campos do formulário
                document.getElementById('titulo').value = '';
                document.getElementById('data').value = '';
            } else {
                alert('Por favor, preencha a data de conclusão.');
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
            listItem.innerHTML = 
                <div>
                    <p>Título: ${tarefa.title}</p>
                    <p>Data de conclusão: ${tarefa.date}</p>
                    <p>Estado: ${tarefa.done}</p>
                    <p>Edidato em: ${tarefa.edited}</p>
                </div>
            ;
            taskList.appendChild(listItem);
        });   
    }

            // Adicionando botão de concluir para cada tarefa
            const doneButton = document.createElement('button');
            if (tarefa.done === 'Pendente') {
                doneButton.innerText = 'Concluído';
            } else {
                doneButton.innerText = 'Pendente';
            }
            doneButton.className = "btn-done";
            doneButton.addEventListener('click', () => mudarDoneTarefa(tarefa));
            listItem.appendChild(doneButton);

            taskList.appendChild(listItem);

        });

        // Exibe o container da lista de Tarefas
        listContainer.style.display = 'block';
 

    // Função para exibir os Tarefas a serem apagados com checkboxes
    function exibirTarefasParaApagar() {
        const apagarList = document.getElementById('apagar-list');
        apagarList.innerHTML = '';

        // Adiciona cada Tarefa da lista de Tarefas ao elemento de lista para apagar na página
        tarefas.forEach((tarefa, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = ` 
                <input type="checkbox" id="apagar-${index}" data-index="${index}">
                <label for="apagar-${index}">${tarefa.title} - ${tarefa.date} ${tarefa.done}</label>
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
            // Caixa de confirmação para apagar doc
            const confirmar = confirm("Você tem certeza que deseja apagar a(s) tarefa(s) selecionada(s)?")
            
            if (confirmar){
                // Obtém os índices dos Tarefas a serem apagados
            const indicesParaApagar = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index));
            // Filtra a lista de Tarefas, removendo os Tarefas que estão marcados para apagar
            tarefas = tarefas.filter((_, index) => !indicesParaApagar.includes(index));
            salvarTarefas();
            alert('Tarefa(s) apagado(s) com sucesso!');
            // Atualiza a lista de Tarefas a serem apagados
            exibirTarefasParaApagar();
            }
            
        } else {
            alert('Por favor, selecione pelo menos um Tarefa para apagar.');
        }
    }

    // Formulário para editar tarefas
    function formEditarTarefa(tarefa) {
        showForm('editar');
        document.getElementById('btn-submit-editar').addEventListener('click', () => editarTarefa(tarefa));
    }
    
    // Função para editar um Tarefa
    function editarTarefa(tarefa) {
        // Obtém os valores dos campos de entrada do formulário
        const title = document.getElementById('titulo-editar').value;
        const date = document.getElementById('data-editar').value;

        // Verifica se o campo título está preenchido
        if (title) {
            // Verifica se o campo data está preenchido
            if (date) {
                // Obtém a data atual
                    const today = new Date().toISOString().split('T')[0];
                    // Verifica se a data é anterior à data atual
                    if (date < today) {
                        alert('A data deve ser a partir de hoje.');
                        return; // Encerra a função se a data for anterior a hoje
                    }

                    // Converte a data para o formato brasileiro
                    const taskDate = new Date(date + 'T00:00:00'); // Adiciona 'T00:00:00' para evitar problemas de fuso horário
                    const formattedDate = taskDate.toLocaleDateString('pt-BR');

                // Adiciona a Tarefa à lista de Tarefas
                console.log('tarefa: ', tarefa);
                tarefa.title = title;
                tarefa.date = formattedDate;
                const todayEdit = new Date();
                tarefa.edited = todayEdit.toLocaleDateString('pt-BR');
                salvarTarefas();
                alert('Tarefa editada com sucesso!');
                showForm('listar');
                showTasks();
                // Limpa os campos do formulário
                document.getElementById('titulo').value = '';
                document.getElementById('data').value = '';

            } else {
                alert('Por favor, preencha a data de conclusão.');
            }
        } else {
            alert('Por favor, preencha o título do Tarefa.');
        }
    }  

    // Função para mudar o estado de done
    function mudarDoneTarefa(tarefa) {
        console.log(tarefa.done);
        // Muda o estado de done da Tarefa
        if (tarefa.done === 'Pendente') {
            tarefa.done = 'Concluído';
        } else {
            tarefa.done = 'Pendente';
        }
        // Salva as tarefas
        salvarTarefas();
        // Atualiza as tarefas
        showTasks();
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

