console.log("Script file started loading");

window.onerror = function(message, source, lineno, colno, error) {
    console.error("Caught error:", message, "at", source, ":", lineno, ":", colno);
    console.error("Error object:", error);
    return true;
};
console.log("Script file loaded");

(function() {
    let appState = {
        employees: [],
        statuses: []
    };

    function init() {
        console.log("Init function called");
        updateStatusList();
        renderEmployees();
        setupColorPickers();
        setupEventListeners();
        console.log("Initialization complete");
    }

    function setupEventListeners() {
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        const addStatusBtn = document.getElementById('addStatusBtn');
        
        if (addEmployeeBtn) {
            addEmployeeBtn.addEventListener('click', addEmployee);
            console.log("Add Employee button listener set");
        } else {
            console.error("Add Employee button not found");
        }
        
        if (addStatusBtn) {
            addStatusBtn.addEventListener('click', addStatus);
            console.log("Add Status button listener set");
        } else {
            console.error("Add Status button not found");
        }
    }

    function setupColorPickers() {
        const statusIndicators = document.querySelectorAll('.status-indicator');
        statusIndicators.forEach((indicator, index) => {
            indicator.style.backgroundColor = appState.statuses[index]?.color || '#cccccc';
            indicator.addEventListener('click', function() {
                editStatusColor(index);
            });
        });
        console.log("Color pickers set up");
    }

    function addEmployee() {
        const nameInput = document.getElementById('newEmployeeName');
        if (!nameInput) {
            console.error("New employee name input not found");
            return;
        }
        const name = nameInput.value.trim();
        if (name) {
            appState.employees.push({ 
                name, 
                status: appState.statuses.length > 0 ? appState.statuses[0].name : '' 
            });
            nameInput.value = '';
            renderEmployees();
            const lastEmployee = document.querySelector('.employee-item:last-child');
            if (lastEmployee) {
                animateNewItem(lastEmployee);
            }
            console.log("New employee added:", name);
        } else {
            showError(nameInput, 'Please enter a valid employee name');
        }
    }

    function addStatus() {
        const nameInput = document.getElementById('newStatusName');
        const colorInput = document.getElementById('newStatusColor');
        if (!nameInput || !colorInput) {
            console.error("New status inputs not found");
            return;
        }
        const name = nameInput.value.trim();
        const color = colorInput.value;
        if (name && color) {
            appState.statuses.push({ name, color });
            nameInput.value = '';
            updateStatusList();
            renderEmployees();
            const lastStatus = document.querySelector('.status-item:last-child');
            if (lastStatus) {
                animateNewItem(lastStatus);
            }
            console.log("New status added:", name, color);
        } else {
            if (!name) showError(nameInput, 'Please enter a valid status name');
        }
    }

    function updateEmployeeStatus(index, newStatus) {
        appState.employees[index].status = newStatus;
        renderEmployees();
        console.log("Employee status updated:", appState.employees[index].name, newStatus);
    }

    function renderEmployees() {
        const employeeList = document.getElementById('employeeList');
        if (!employeeList) {
            console.error("Employee list container not found");
            return;
        }
        employeeList.innerHTML = '';
        appState.employees.forEach((employee, index) => {
            const employeeItem = createEmployeeElement(employee, index);
            employeeList.appendChild(employeeItem);
        });
        console.log("Employees rendered, count:", appState.employees.length);
    }

    function createEmployeeElement(employee, index) {
        const employeeItem = document.createElement('div');
        employeeItem.className = 'employee-item';
        
        const statusColor = appState.statuses.find(s => s.name === employee.status)?.color || '#cccccc';
        
        employeeItem.innerHTML = `
            <div class="status-indicator" style="background-color: ${statusColor};"></div>
            <div class="employee-info">${employee.name}</div>
            <select>
                ${appState.statuses.map(status => `<option ${employee.status === status.name ? 'selected' : ''}>${status.name}</option>`).join('')}
            </select>
            <div class="status-actions">
                <button class="edit-button">Edit Name</button>
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        const select = employeeItem.querySelector('select');
        select.addEventListener('change', function() {
            updateEmployeeStatus(index, this.value);
        });

        const editButton = employeeItem.querySelector('.edit-button');
        editButton.addEventListener('click', () => editEmployee(index));

        const deleteButton = employeeItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteEmployee(index));

        return employeeItem;
    }

    function editEmployee(index) {
        const newName = prompt('Enter new name for employee:', appState.employees[index].name);
        if (newName !== null && newName.trim() !== '') {
            appState.employees[index].name = newName.trim();
            renderEmployees();
            console.log("Employee name edited:", newName);
        }
    }

    function deleteEmployee(index) {
        if (confirm(`Are you sure you want to delete ${appState.employees[index].name}?`)) {
            const deletedName = appState.employees[index].name;
            appState.employees.splice(index, 1);
            renderEmployees();
            console.log("Employee deleted:", deletedName);
        }
    }

    function updateStatusList() {
        const statusList = document.getElementById('statusList');
        if (!statusList) {
            console.error("Status list container not found");
            return;
        }
        statusList.innerHTML = '';
        appState.statuses.forEach((status, index) => {
            const statusItem = createStatusElement(status, index);
            statusList.appendChild(statusItem);
        });
        console.log("Status list updated, count:", appState.statuses.length);
    }

    function createStatusElement(status, index) {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        statusItem.innerHTML = `
            <div class="status-indicator" style="background-color: ${status.color};"></div>
            <div class="status-name">${status.name}</div>
            <div class="status-actions">
                <button class="edit-button">Edit Name</button>
                <button class="delete-button">Delete</button>
            </div>
        `;

        const editButton = statusItem.querySelector('.edit-button');
        editButton.addEventListener('click', () => editStatus(index));

        const deleteButton = statusItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteStatus(index));

        return statusItem;
    }

    function editStatus(index) {
        const newName = prompt('Enter new name for status:', appState.statuses[index].name);
        if (newName !== null && newName.trim() !== '') {
            appState.statuses[index].name = newName.trim();
            updateStatusList();
            renderEmployees();
            console.log("Status name edited:", newName);
        }
    }

    function editStatusColor(index) {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = appState.statuses[index]?.color || '#ffffff';

        colorPicker.addEventListener('input', function() {
            appState.statuses[index].color = this.value;
            updateStatusList();
            renderEmployees();
        });

        colorPicker.addEventListener('change', function() {
            document.body.removeChild(colorPicker);
            console.log("Status color updated:", appState.statuses[index].name, this.value);
        });

        document.body.appendChild(colorPicker);
        colorPicker.click();
    }

    function deleteStatus(index) {
        if (confirm(`Are you sure you want to delete ${appState.statuses[index].name}?`)) {
            const deletedName = appState.statuses[index].name;
            appState.statuses.splice(index, 1);
            updateStatusList();
            renderEmployees();
            console.log("Status deleted:", deletedName);
        }
    }

    function animateNewItem(element) {
        element.classList.add('fade-in');
        setTimeout(() => {
            element.classList.remove('fade-in');
        }, 500);
    }

    function showError(input, message) {
        alert(message);
        input.focus();
        console.error("Error shown:", message);
    }

    // Check if the DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        console.log("DOMContentLoaded event listener added");
    } else {
        console.log("DOM already loaded, calling init directly");
        init();
    }

    // Expose init function to global scope for debugging
    window.initEmployeeLocator = init;
})();

console.log("Script file fully parsed");
console.log("Script file finished loading");
