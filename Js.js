let appState = {
    employees: [],
    statuses: []  // Start with an empty array
};

function init() {
    updateStatusList();
    renderEmployees();
    setupColorPickers();
    document.getElementById('addEmployeeBtn').addEventListener('click', addEmployee);
    document.getElementById('addStatusBtn').addEventListener('click', addStatus);

    // Setup click event listener for the loadButton
    document.getElementById('loadButton').addEventListener('click', clickToLoad);
}

// Define clickToLoad function
function clickToLoad(event) {
    // Implement your logic here to handle the click event
    console.log('Element clicked! Implement your logic here.');
    // Example: Load content or trigger an action
}

function setupColorPickers() {
    // Set up color pickers for each status indicator
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach((indicator, index) => {
        indicator.style.backgroundColor = appState.statuses[index]?.color || '#cccccc'; // Default color if no status exists
        indicator.addEventListener('click', function() {
            editStatusColor(index);
        });
    });
}

function addEmployee() {
    const nameInput = document.getElementById('newEmployeeName');
    const name = nameInput.value.trim();
    if (name) {
        appState.employees.push({ name, status: appState.statuses.length > 0 ? appState.statuses[0].name : '' }); // Default to first status if available
        nameInput.value = '';
        renderEmployees();
        animateNewItem(document.querySelector('.employee-item:last-child'));
    } else {
        showError(nameInput, 'Please enter a valid employee name');
    }
}

function addStatus() {
    const nameInput = document.getElementById('newStatusName');
    const colorInput = document.getElementById('newStatusColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    if (name && color) {
        appState.statuses.push({ name, color });
        nameInput.value = '';
        updateStatusList();
        renderEmployees();
        animateNewItem(document.querySelector('.status-item:last-child'));
    } else {
        if (!name) showError(nameInput, 'Please enter a valid status name');
    }
}

function updateEmployeeStatus(index, newStatus) {
    appState.employees[index].status = newStatus;
    renderEmployees();
}

function renderEmployees() {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';
    appState.employees.forEach((employee, index) => {
        const employeeItem = createEmployeeElement(employee, index);
        employeeList.appendChild(employeeItem);
    });
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
            <button class="edit-button" onclick="editEmployee(${index})">Edit Name</button>
            <button class="delete-button" onclick="deleteEmployee(${index})">Delete</button>
        </div>
    `;
    employeeItem.querySelector('select').addEventListener('change', function() {
        updateEmployeeStatus(index, this.value);
    });

    return employeeItem;
}

function editEmployee(index) {
    const newName = prompt('Enter new name for employee:', appState.employees[index].name);
    if (newName !== null && newName.trim() !== '') {
        appState.employees[index].name = newName.trim();
        renderEmployees();
    }
}

function deleteEmployee(index) {
    if (confirm(`Are you sure you want to delete ${appState.employees[index].name}?`)) {
        appState.employees.splice(index, 1);
        renderEmployees();
    }
}

function updateStatusList() {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';
    appState.statuses.forEach((status, index) => {
        const statusItem = createStatusElement(status, index);
        statusList.appendChild(statusItem);
    });
}

function createStatusElement(status, index) {
    const statusItem = document.createElement('div');
    statusItem.className = 'status-item';
    statusItem.innerHTML = `
        <div class="status-indicator" style="background-color: ${status.color};"></div>
        <div class="status-name">${status.name}</div>
        <div class="status-actions">
            <button class="edit-button" onclick="editStatus(${index})">Edit Name</button>
            <button class="delete-button" onclick="deleteStatus(${index})">Delete</button>
        </div>
    `;
    return statusItem;
}

function editStatus(index) {
    const newName = prompt('Enter new name for status:', appState.statuses[index].name);
    if (newName !== null && newName.trim() !== '') {
        appState.statuses[index].name = newName.trim();
        updateStatusList();
        renderEmployees();
    }
}

function editStatusColor(index) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = appState.statuses[index]?.color || '#ffffff'; // Default color picker to white

    colorPicker.addEventListener('input', function() {
        appState.statuses[index].color = this.value;
        updateStatusList();
        renderEmployees();
    });

    colorPicker.addEventListener('change', function() {
        document.body.removeChild(colorPicker);
    });

    // Display the color picker to the user
    colorPicker.click();
}

function deleteStatus(index) {
    if (confirm(`Are you sure you want to delete ${appState.statuses[index].name}?`)) {
        appState.statuses.splice(index, 1);
        updateStatusList();
        renderEmployees();
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
}

document.addEventListener('DOMContentLoaded', init);
