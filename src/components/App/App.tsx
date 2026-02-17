import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { NoteList } from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);


  const { data, isLoading, isError } = useQuery({
  queryKey: ["notes", debouncedSearch, page],
  queryFn: () => fetchNotes(debouncedSearch, page),

  placeholderData: (previousData) => previousData,
});


  return (
    <div>
      <header>
        <button onClick={() => setModalOpen(true)}>Create Note</button>
      </header>

      <SearchBox value={search} onChange={setSearch} />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && (
        <>

          {data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}

          <NoteList notes={data.notes} />
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
