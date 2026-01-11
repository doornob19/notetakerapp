const dialog = document.getElementById("note-dialog");
const dialogForm = document.getElementById("dialog-form");
const notesContainer = document.querySelector(".notes-container");
applyStoredTheme();
let notes = loadNotes() || [];
renderNotes();

document.addEventListener("click", (e) => {
    if (e.target.closest(".add-notes-btn")) {
        dialog.showModal();
        return;
    }

    if (e.target.closest(".close-btn")) {
        dialog.close();
        return;
    }

    if (e.target.closest(".cancel-btn")) {
        dialog.close();
        dialogForm.reset();
        return;
    }

    if (e.target.closest(".theme-btn")) {
        toggleTheme();
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
    }
});

dialogForm.addEventListener("submit", saveNote);

function saveNote(e) {
    e.preventDefault();

    const title = document.getElementById("note-title").value.trim();
    const content = document.getElementById("note-content").value.trim();
    
    notes.unshift({
        id: generateId(),
        title: title,
        content: content,
    });

    saveNotes();
    renderNotes();
    dialog.close();
    dialogForm.reset();
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
    notesContainer.innerHTML = "";

    if (notes.length === 0) {
        notesContainer.innerHTML = `
        <div class="empty-state">
            <h2>No notes yet</h2>
            <p>Create your first note to get started!</p>
            <button class="add-notes-btn">+ Add Note</button>
        </div>
        `;
        return;
    }

    notes.forEach((note) => {
        notesContainer.innerHTML += `
        <div class="note-card">
            <div class="note-header">
                <h3 class="note-title">${note.title}</h3>
                <div class="note-actions">
                    <button class="edit-note-btn" type="button" data-id="${note.id}">
                        <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="delete-note-btn" type="button" data-id="${note.id}">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M4 7h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
                            <path d="M10 11v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
                            <path d="M14 11v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
                            <path d="M6 7l1 14h10l1-14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/>
                            <path d="M9 7V4h6v3" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <p class="note-content">${note.content}</p>
        </div>
        `
    });
}

function deleteNote(id) {
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