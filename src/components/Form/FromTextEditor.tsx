import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faQuoteRight,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorProps } from '@tiptap/pm/view';
import { EditorEvents, EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { ControllerRenderProps } from 'react-hook-form';

const EditorToolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border border-b-0 px-4 py-2 text-lg">
      <div
        className="flex items-center gap-x-1"
        role="group"
        aria-label="heading"
      >
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded p-4 hover:bg-gray-100',
            {
              'font-bold': editor.isActive('heading', { level: 1 }),
              'text-gray-400': !editor.isActive('heading', { level: 1 }),
            },
          )}
          aria-label="heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded p-4 hover:bg-gray-100',
            {
              'font-bold': editor.isActive('heading', { level: 2 }),
              'text-gray-400': !editor.isActive('heading', { level: 2 }),
            },
          )}
          aria-label="heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded p-4 hover:bg-gray-100',
            {
              'font-bold': editor.isActive('heading', { level: 3 }),
              'text-gray-400': !editor.isActive('heading', { level: 3 }),
            },
          )}
          aria-label="heading 3"
        >
          H3
        </button>
      </div>
      <div
        className="flex items-center gap-x-1"
        role="group"
        aria-label="font weight"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('bold'),
            },
          )}
          aria-label="bold"
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('italic'),
            },
          )}
          aria-label="italic"
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('underline'),
            },
          )}
          aria-label="underline"
        >
          <FontAwesomeIcon icon={faUnderline} />
        </button>
      </div>
      <div
        className="flex items-center gap-x-1"
        role="group"
        aria-label="text alignment"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive({ textAlign: 'left' }),
            },
          )}
          aria-label="align left"
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive({ textAlign: 'center' }),
            },
          )}
          aria-label="align center"
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive({ textAlign: 'right' }),
            },
          )}
          aria-label="align right"
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
      </div>
      <div className="flex items-center gap-x-1" role="group" aria-label="list">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('bulletList'),
            },
          )}
          aria-label="unordered list"
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('orderedList'),
            },
          )}
          aria-label="ordered list"
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
      </div>
      <div
        className="flex items-center gap-x-1"
        role="group"
        aria-label="others"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('blockquote'),
            },
          )}
          aria-label="blockquote"
        >
          <FontAwesomeIcon icon={faQuoteRight} />
        </button>
        <button
          type="button"
          onClick={() => {
            const previousLink = editor.getAttributes('link').href;
            const url = window.prompt('Attached URL', previousLink);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: url })
              .run();
          }}
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100',
            {
              'text-gray-400': !editor.isActive('link'),
            },
          )}
          aria-label="link attachment"
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
      </div>
    </div>
  );
};

const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link,
  Placeholder.configure({
    placeholder: 'Insert product description here...',
    emptyNodeClass:
      'first:before:pointer-events-none first:before:float-left first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)]',
  }),
];

const editorProps: EditorProps = {
  attributes: {
    class:
      'prose prose-headings:font-inherit prose-p:mb-4 prose-p:mt-0 prose-a:text-blue-600 prose-a:cursor-pointer h-[13rem] max-w-none overflow-y-auto rounded border p-4 outline-none',
  },
};

type FromTextEditorProps = {
  onChange: ControllerRenderProps['onChange'];
};

export const FromTextEditor: React.FC<FromTextEditorProps> = (props) => {
  const { onChange } = props;

  const handleUpdate = ({ editor }: EditorEvents['update']) => {
    if (editor.getText().trim() === '') onChange('');
    else onChange(editor.getHTML());
  };

  return (
    <EditorProvider
      slotBefore={<EditorToolbar />}
      extensions={extensions}
      editorProps={editorProps}
      onUpdate={handleUpdate}
    >
      <></>
    </EditorProvider>
  );
};
