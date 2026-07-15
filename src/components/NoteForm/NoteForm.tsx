import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onClose: () => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),

  content: Yup.string().max(500, "Maximum 500 characters"),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createNote,
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["notes"],
    });

    onClose();
  },
});
  const handleSubmit = (values: NoteFormValues) => {
  mutation.mutate(values);
};

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>

            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />

            <ErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>

            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />

            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>

            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>

            <ErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          </div>

   {mutation.isError && (
          <p className={css.error}>
            Failed to create note. Please try again.
          </p>
        )}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
  type="submit"
  className={css.submitButton}
  disabled={isSubmitting || mutation.isPending}
>
  {mutation.isPending ? "Creating..." : "Create note"}
</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;