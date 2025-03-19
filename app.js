import notesData from './notesData.js';

class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.note = {};
    }

    connectedCallback() {
        this.note = JSON.parse(this.getAttribute('note'));
        this.render();
    }

    render() {
        const formattedBody = this.note.body
            .replace(/\n/g, '<br>') 
            .replace(/  /g, '&nbsp;&nbsp;');

        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background: white;
                    border-left: 4px solid #3498db;
                    border-radius: 10px;
                    padding: 1.5rem;
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .note:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                }

                .note h3 {
                    margin: 0 0 1rem 0;
                    color: #2c3e50;
                    font-size: 1.25rem;
                    padding-bottom: 0.8rem;
                    border-bottom: 1px solid #eee;
                }

                .note p {
                    color: #34495e;
                    line-height: 1.6;
                    margin: 0 0 1.2rem 0;
                    white-space: pre-line;
                }

                .note small {
                    display: block;
                    color: #7f8c8d;
                    font-size: 0.85rem;
                    padding-top: 1rem;
                    border-top: 1px solid #eee;
                }

                .edit-btn, .delete-btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.3s ease;
                    margin-right: 0.5rem;
                }

                .edit-btn:hover {
                    background: #2980b9;
                }

                .delete-btn {
                    background: #e74c3c;
                }

                .delete-btn:hover {
                    background: #c0392b;
                }
            </style>
            <div class="note">
                <h3>${this.note.title}</h3>
                <p>${formattedBody}</p>
                <small>${new Date(this.note.createdAt).toLocaleString()}</small>
                <button class="edit-btn" data-id="${this.note.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" data-id="${this.note.id}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;

        this.shadowRoot.querySelector('.edit-btn').addEventListener('click', () => this.editNote());
        this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => this.deleteNote());
    }

    editNote() {
        document.getElementById('title').value = this.note.title;
        document.getElementById('body').value = this.note.body;
        
        // Remove the note from the array
        notesData.splice(notesData.indexOf(this.note), 1);
        displayNotes();
    }

    deleteNote() {
        const noteIndex = notesData.findIndex(note => note.id === this.note.id);
        
        if (noteIndex !== -1) {
            notesData.splice(noteIndex, 1);
            displayNotes();
        }
    }
}

customElements.define('note-item', NoteItem);

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .input-group {
                    margin-bottom: 1.5rem;
                }

                input[type="text"],
                textarea {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                input[type="text"]:focus,
                textarea:focus {
                    border-color: #3498db;
                    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
                    outline: none;
                }

                button[type="submit"] {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    width: 100%;
                    display: flex; 
                    align-items: center;
                    justify-content: center; 
                }

                button[type="submit"] i {
                    margin-right: 0.5rem;
                }

                button[type="submit"]:hover {
                    background: #2980b9;
                    transform: translateY(-2px);
                }
            </style>
            <form id="form">
                <div class="input-group">
                    <input type="text" id="title" placeholder="Judul" maxlength="100" required>
                </div>
                <div class="input-group">
                    <textarea id="body" placeholder="Isi Catatan" required></textarea>
                </div>
                <button type="submit"><i class="fas fa-save"></i> Simpan Catatan</button>
            </form>
        `;

        this.shadowRoot.getElementById('form').addEventListener('submit', (event) => this.submitForm(event));
    }

    submitForm(event) {
        event.preventDefault();
        const title = this.shadowRoot.getElementById('title').value;
        const body = this.shadowRoot.getElementById('body').value;

        const newNote = {
            id: `notes-${Date.now()}`,
            title: title,
            body: body,
            createdAt: new Date().toISOString(),
            archived: false,
        };

        notesData.push(newNote);
        displayNotes();
        this.shadowRoot.getElementById('form').reset();
    }
}

customElements.define('note-form', NoteForm);

class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: linear-gradient(to right, #2d2b30, #a453f0);
                    color: white;
                    padding: 1.5rem;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo {
                    display: flex;
                    align-items: center;
                }

                .logo img {
                    width: 32px;
                    height: 32px;
                    margin-right: 1rem;
                }

                nav {
                    display: flex;
                    gap: 1rem;
                }

                nav a {
                    color: white;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-size: 1.25rem
                }

                nav a:hover {
                    color: #3498db;
                }

                .social {
                    display: flex;
                    align-items: center;
                }

                .social a {
                    color: white;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .social a:hover {
                    color: #3498db;
                }

                .social img {
                    width: 32px;
                    height: 32px;
                    margin-right: 1rem;
                }
            </style>
            <header>
                <div class="logo">
                    <img src="images/notes.png" alt="Notes Icon">
                    <h1>Notes App</h1>
                </div>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div class="social">
                    <a href="https://github.com/Fatlem/Notes-App" target="_blank">
                        <img src="images/github.png" alt="GitHub Icon">
                    </a>
                </div>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);

function displayNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    notesData.forEach(note => {
        const noteElement = document.createElement('note-item');
        noteElement.setAttribute('note', JSON.stringify(note));
        notesContainer.appendChild(noteElement);
    });
}

displayNotes();
