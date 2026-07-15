import axios from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: Note["tag"];
}

export const fetchNotes = async ({
  page,
  perPage,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(`${API_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    params: {
      page,
      perPage,
      search,
    },
  });

  return response.data;
};

export const createNote = async (
  note: CreateNoteParams,
): Promise<Note> => {
  const response = await axios.post<Note>(`${API_URL}/notes`, note, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${API_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};