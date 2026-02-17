import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from '@tanstack/react-query';
import ReactPaginate from "react-paginate";
import { useDebouncedCallback } from "use-debounce";

import css from "./App.module.css";
import { NoteList } from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";

export default function App() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const queryOptions: UseQueryOptions<{ hits: Note[]; nbPages: number }, Error> = {
    queryKey: ["notes", search, currentPage],
    queryFn: () => fetchNotes(search, currentPage),
    enabled: search !== "",
    // keepPreviousData: true,
  };

  const { data, isLoading, isError, isSuccess } = useQuery(queryOptions);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const totalPages = data?.nbPages ?? 0;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={debouncedSearch} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching notes!</p>}

      {data && data.hits.length > 0 && (
        <NoteList
          notes={data.hits}
          onDelete={(id: number) => deleteMutation.mutate(id)}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
