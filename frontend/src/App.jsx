// import { useEffect, useState } from "react";
// import api from "./api";
// import "./App.css";

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [form, setForm] = useState({ title: "", content: "" });

//   const loadNotes = async () => {
//     const res = await api.get("/notes");
//     setNotes(res.data);
//   };

//   const addNote = async (e) => {
//     e.preventDefault();
//     if (!form.title.trim()) return;
//     await api.post("/notes", form);
//     setForm({ title: "", content: "" });
//     loadNotes();
//   };

//   const deleteNote = async (id) => {
//     await api.delete(`/notes/${id}`);
//     loadNotes();
//   };

//   useEffect(() => {
//     loadNotes();
//   }, []);

//   return (
//     <div className="container">
//       <h1>QuickNotes</h1>

//       <form onSubmit={addNote} className="note-form">
//         <input
//           placeholder="Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           required
//         />
//         <textarea
//           placeholder="Content (optional)"
//           value={form.content}
//           onChange={(e) => setForm({ ...form, content: e.target.value })}
//         ></textarea>
//         <button type="submit">Add Note</button>
//       </form>

//       <div className="notes-list">
//         {notes.map((note) => (
//           <div className="note-card" key={note.id}>
//             <h3>{note.title}</h3>
//             <p>{note.content}</p>
//             <button className="delete" onClick={() => deleteNote(note.id)}>
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

import { BsGridFill, BsListUl } from "react-icons/bs";
import { FiMoon, FiSun } from "react-icons/fi";
function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [view, setView] = useState("list");
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState(""); // NEW
 // DARK MODE STATE (loads from storage)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
   // APPLY DARK MODE
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);
  // Load notes
  const loadNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };

  // Add note
  const addNote = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      await api.post("/notes", form);
      setForm({ title: "", content: "" });
      loadNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      loadNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Save edited note
  const saveEdit = async () => {
    try {
      await api.put(`/notes/${editingNote.id}`, editForm);
      setEditingNote(null);
      loadNotes();
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="container">
      <h1>QuickNotes</h1>

      {/* SEARCH BAR */}
      {/* <input
        type="text"
        className="search-bar"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> */}

      {/* Add note form */}
      <form onSubmit={addNote} className="note-form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Content (optional)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        ></textarea>
       
        <button type="submit" className="add-btn">
          Add Note
        </button>
      </form>

      {/* VIEW TOGGLE BUTTON */}
     <div
  className="view-toggle"
  onClick={() => setView(view === "list" ? "grid" : "list")}
>
  {view === "list" ? <BsGridFill size={22} /> : <BsListUl size={22} />}
</div>

<input
  type="text"
  className="search-bar"
  placeholder="Search notes..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>


      {/* NOTES LIST */}
      <div className={`notes-list ${view}`}>
        {notes.length === 0 && <p>No notes yet. Add one!</p>}

        {notes
          .filter((note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((note) => (
            <div className="note-card" key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>

              {/* Edit Button */}
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingNote(note);
                  setEditForm({
                    title: note.title,
                    content: note.content,
                  });
                }}
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                className="delete-btn"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      {/* EDIT MODAL */}
      {editingNote && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Note</h2>

            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />

            <textarea
              value={editForm.content}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
            ></textarea>

            <button className="save-btn" onClick={saveEdit}>
              Save Changes
            </button>

            <button
              className="cancel-btn"
              onClick={() => setEditingNote(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

