import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "../../services/noteService";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";

function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <h1>NoteHub</h1>

        <SearchBox
          value={searchInput}
          onChange={handleSearchChange}
        />

        <button
          className={css.button}
          type="button"
          onClick={openModal}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;