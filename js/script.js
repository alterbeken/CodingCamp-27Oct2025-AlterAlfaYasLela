document.addEventListener('DOMContentLoaded', () => {

    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
 
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter-select');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const noTaskMsg = document.getElementById('no-task-msg');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

       const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const checkEmptyList = () => {

        if (todos.length === 0) {
            noTaskMsg.classList.remove('hidden');
        } else {
            noTaskMsg.classList.add('hidden');
        }
    };

    const renderTodos = (filter = 'all') => {

        todoList.innerHTML = '';

         let filteredTodos = todos;
        if (filter === 'pending') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            }
            
            todoItem.dataset.id = todo.id;

            let formattedDate = 'No date';
            if (todo.dueDate) {
                const dateParts = todo.dueDate.split('-');
                const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                formattedDate = dateObj.toLocaleDateString('id-ID'); 
            }

            const statusText = todo.completed ? 'Completed' : 'Pending';

            todoItem.innerHTML = `
                <span class="task-text">${todo.text}</span>
                <span class="task-date">${formattedDate}</span>
                <span class="task-status" data-status="${statusText.toLowerCase()}">${statusText}</span>
                <div class="task-actions">
                    <button class="action-btn complete-btn" title="Mark as ${todo.completed ? 'pending' : 'complete'}">
                        <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
        });

          checkEmptyList();
    };


    const addTask = (e) => {
        e.preventDefault(); 
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value; // Format: "yyyy-mm-dd"

        if (taskText === '') {
            alert('Please add a task text.');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: taskText,
            dueDate: dueDate,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos(filterSelect.value);

        taskInput.value = '';
        dueDateInput.value = '';
    };


    const handleTodoActions = (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const todoId = Number(item.dataset.id);

        if (e.target.closest('.complete-btn')) {
            todos = todos.map(todo => 
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            );
        }

        if (e.target.closest('.delete-btn')) {
            todos = todos.filter(todo => todo.id !== todoId);
        }

        saveTodos();
        renderTodos(filterSelect.value);
    };


    const filterTasks = () => {
        renderTodos(filterSelect.value);
    };


    const deleteAllTasks = () => {
        if (confirm('Are you sure you want to delete ALL tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        if (isDarkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    const loadTheme = () => {
        const preferredTheme = localStorage.getItem('theme');
        if (preferredTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {

            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    todoForm.addEventListener('submit', addTask);
    todoList.addEventListener('click', handleTodoActions);
    filterSelect.addEventListener('change', filterTasks);
    deleteAllBtn.addEventListener('click', deleteAllTasks);
    themeToggleBtn.addEventListener('click', toggleTheme); 

    loadTheme(); 
    renderTodos(); 
});