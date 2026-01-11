const dialog = document.getElementById("note-dialog");
const dialogForm = document.getElementById("dialog-form");
const notesContainer = document.querySelector(".notes-container");
applyStoredTheme();
let notes = loadNotes() || [];
let editingId = null;
renderNotes();

document.addEventListener("click", (e) => {
    if (e.target.closest(".add-notes-btn")) {
        resetDialog();
        dialog.showModal();
        return;
    }

    if (e.target.closest(".close-btn") || e.target.closest(".cancel-btn")) {
        dialog.close();
        resetDialog();
        return;
    }

    if (e.target.closest(".theme-btn")) {
        toggleTheme();
        return;
    }

    const editBtn = e.target.closest(".edit-note-btn");
    if (editBtn) {
        const id = editBtn.dataset.id;
        const note = notes.find(n => n.id === id);
        if (!note) return;
        editingId = id;
        document.getElementById("note-title").value = note.title;
        document.getElementById("note-content").value = note.content;
        document.querySelector(".dialog-title").textContent = "Edit Note";
        dialog.showModal();
        return;
    }

    const deleteBtn = e.target.closest(".delete-note-btn");
    if (deleteBtn) {
        deleteNote(deleteBtn.dataset.id);
        return;
    }
});

dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
        dialog.close();
        resetDialog();
    }
});

function resetDialog() {
    dialogForm.reset();
    editingId = null;
    document.querySelector(".dialog-title").textContent = "Add New Note";
}

dialogForm.addEventListener("submit", saveNote);

function saveNote(e) {
    e.preventDefault();

    const title = document.getElementById("note-title").value.trim();
    const content = document.getElementById("note-content").value.trim();

    if (!title || !content) return;

    if (editingId) {
        const index = notes.findIndex(n => n.id === editingId);
        if (index !== -1) {
            notes[index].title = title;
            notes[index].content = content;
        }
    }
    else {
        notes.unshift({
        id: generateId(),
        title: title,
        content: content,
    });
    }

    saveNotes();
    renderNotes();
    dialog.close();
    resetDialog();
}

function generateId() {
    return Date.now().toString();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    return JSON.parse(localStorage.getItem('notes'));
}

function renderNotes() {
    notesContainer.replaceChildren();

  if (notes.length === 0) {
    const empty = createEl("div", "empty-state");

    const h2 = createEl("h2", "", { textContent: "No notes yet" });
    const p  = createEl("p", "", { textContent: "Create your first note to get started!" });
    const addNotesBtn = createEl("button", "add-notes-btn", { type: "button", textContent: "+ Add Note"});

    empty.append(h2, p, addNotesBtn);
    notesContainer.append(empty);
    return;
  }

  for (const note of notes) {
    const card = createEl("div", "note-card");
    const header = createEl("div", "note-header");
    const title = createEl("h3", "note-title", { textContent: note.title });
    const actions = createEl("div", "note-actions");

    const editBtn = createEl("button", "edit-note-btn", { type: "button" });
    editBtn.dataset.id = note.id;
    editBtn.innerHTML = `
      <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    `;

    const deleteBtn = createEl("button", "delete-note-btn", { type: "button" });
    deleteBtn.dataset.id = note.id;
    deleteBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 7h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
        <path d="M10 11v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
        <path d="M14 11v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
        <path d="M6 7l1 14h10l1-14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/>
        <path d="M9 7V4h6v3" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/>
      </svg>
    `;

    actions.append(editBtn, deleteBtn);
    header.append(title, actions);

    const content = createEl("p", "note-content", { textContent: note.content });

    card.append(header, content);
    notesContainer.append(card);
  }
}

function createEl(tag, className = "", props = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.assign(node, props);
  return node;
}

function deleteNote(id) {
    if (editingId === id) {
        dialog.close();
        resetDialog();
    }
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector(".theme-btn").textContent = isDark ? '☀️' : '🌙';
}

function applyStoredTheme() {
    const isDark = localStorage.getItem("theme") === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    document.querySelector(".theme-btn").textContent = isDark ? "☀️" : "🌙";
}