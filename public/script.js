const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const formTitle = document.querySelector('#form-title');
const message = document.querySelector('#message');

const STORAGE_KEY = 'workshop-projects-v1';

let projects = [];
let editingId = null;
let storageCanSave = true;

// Display messages safely.
function showMessage(text) {
  message.textContent = text;
}

// Check whether saved project data has the expected structure.
function isValidProjects(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  const validStatuses = ['Planned', 'In Progress', 'Completed'];
  const ids = new Set();

  for (const project of data) {
    if (
      project === null ||
      typeof project !== 'object' ||
      Array.isArray(project) ||
      typeof project.id !== 'string' ||
      project.id.trim() === '' ||
      typeof project.name !== 'string' ||
      project.name.trim() === '' ||
      !validStatuses.includes(project.status) ||
      ids.has(project.id)
    ) {
      return false;
    }

    ids.add(project.id);
  }

  return true;
}

// Restore saved projects when the page starts.
function loadProjects() {
  let savedText;

  try {
    savedText = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    storageCanSave = false;
    showMessage(
      'Could not read saved projects. Browser storage may be unavailable.'
    );
    return;
  }

  // No saved data means start with an empty array.
  if (savedText === null) {
    projects = [];
    return;
  }

  let savedProjects;

  try {
    // JSON.parse converts stored text into a JavaScript value.
    savedProjects = JSON.parse(savedText);
  } catch (error) {
    storageCanSave = false;
    showMessage(
      'Saved project data is malformed. Existing stored data was not changed.'
    );
    return;
  }

  if (!isValidProjects(savedProjects)) {
    storageCanSave = false;
    showMessage(
      'Saved project data is invalid. Existing stored data was not changed.'
    );
    return;
  }

  projects = savedProjects;
}

// Save the current projects array.
function saveProjects() {
  if (!storageCanSave) {
    showMessage(
      'Changes could not be saved because existing stored data could not be loaded safely.'
    );
    return false;
  }

  try {
    // JSON.stringify converts the array into text for storage.
    const savedText = JSON.stringify(projects);
    localStorage.setItem(STORAGE_KEY, savedText);
    showMessage('Project changes saved.');
    return true;
  } catch (error) {
    showMessage(
      'Project changes could not be saved to browser storage.'
    );
    return false;
  }
}

// Display all projects.
function renderProjects() {
  projectList.textContent = '';

  projects.forEach(project => {
    const item = document.createElement('li');

    const details = document.createElement('span');
    details.textContent = `${project.name} — ${project.status}`;

    // Edit button.
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Edit';

    editButton.addEventListener('click', () => {
      editingId = project.id;

      nameInput.value = project.name;
      statusInput.value = project.status;

      saveButton.textContent = 'Save changes';
      cancelButton.textContent = 'Cancel edit';
      cancelButton.hidden = false;
      formTitle.textContent = 'Edit a Project';

      nameInput.focus();
    });

    // Delete button.
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${project.name}"?`
      );

      // Cancelled deletion does not change anything.
      if (!confirmed) {
        return;
      }

      const projectIndex = projects.findIndex(
        item => item.id === project.id
      );

      if (projectIndex === -1) {
        return;
      }

      projects.splice(projectIndex, 1);

      // If the deleted project was being edited, reset the form.
      if (editingId === project.id) {
        resetForm();
      }

      saveProjects();
      renderProjects();
    });

    item.append(details, ' ', editButton, ' ', deleteButton);
    projectList.appendChild(item);
  });

  emptyState.hidden = projects.length > 0;
}

// Return the form to Add mode.
function resetForm() {
  editingId = null;
  form.reset();

  saveButton.textContent = 'Save Project';
  cancelButton.textContent = 'Cancel';
  cancelButton.hidden = true;
  formTitle.textContent = 'Add a Project';
}

// Handle Add and Edit.
form.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value;

  if (!name) {
    nameInput.setCustomValidity('Enter a project name.');
    nameInput.reportValidity();
    nameInput.setCustomValidity('');
    nameInput.focus();
    return;
  }

  if (!['Planned', 'In Progress', 'Completed'].includes(status)) {
    showMessage('Please select a valid project status.');
    return;
  }

  if (editingId === null) {
    // Add a new project with a unique ID.
    projects.push({
      id: crypto.randomUUID(),
      name: name,
      status: status
    });
  } else {
    // Update the project without changing its ID.
    const project = projects.find(
      item => item.id === editingId
    );

    if (!project) {
      showMessage('Could not find the project being edited.');
      resetForm();
      return;
    }

    project.name = name;
    project.status = status;
  }

  saveProjects();
  renderProjects();
  resetForm();
});

// Cancel editing without changing stored projects.
cancelButton.addEventListener('click', () => {
  resetForm();
});

// Load saved data and display the list when the page starts.
loadProjects();
renderProjects();

