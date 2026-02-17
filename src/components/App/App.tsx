import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery(
    ["notes", search, page],
    () => fetchNotes(search, page),
    {
      keepPreviousData: true,
      placeholderData: { notes: [], totalPages: 1 },
    }
  );

  return (
    <div>
      <header>
        <h1>NoteHub</h1>
        <button onClick={() => setModalOpen(true)}>Create Note</button>
      </header>

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
