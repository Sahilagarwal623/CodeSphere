import React, { useEffect, useRef, useState } from 'react';
import Toggle from './Toggle';
import Editor from '@monaco-editor/react';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import customDebounce from '../utility/debounce.js';

export default function CodeEditor({ getSocket, setsocketInitialized, mode, language, setlanguage, getEditorRef, Console, setopenconsole }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const username = useSelector(state => state.auth.user.username);
  const { roomId } = useParams();
  const [darkTheme, setDarkTheme] = useState(true);
  const [open, setopen] = useState(false);
  const socketRef = useRef(null);
  const isLocalChangeRef = useRef(true); // ✅ Use a ref instead of state to avoid re-renders


  const fakeCursorDecorations = useRef({});

  function showFakeCursor(userId, position) {
    if (!editorRef.current) return;

    const newDecoration = {
      range: new monacoRef.current.Range(position.lineNumber, position.column, position.lineNumber, position.column),
      options: {
        className: 'fake-cursor',
        afterContentClassName: 'fake-cursor-label',
      },
    };

    const previousDecorationId = fakeCursorDecorations.current[userId] || [];

    const newDecorationIds = editorRef.current.deltaDecorations(previousDecorationId, [newDecoration]);

    fakeCursorDecorations.current[userId] = newDecorationIds;
  }


  function handleEditorDidMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;

    if (getEditorRef) {
      getEditorRef(editor);
    }

    monaco.editor.defineTheme("black-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#FFFFFF",
        "editorCursor.foreground": "#FFFFFF",
        "editorLineNumber.foreground": "#888888",
        "editor.lineHighlightBackground": "#1a1a1a",
      }
    });
    monaco.editor.setTheme("black-theme");

    if (mode === 'online' && editorRef.current) {
      const handleContentChange = () => {
        if (!isLocalChangeRef.current) {
          isLocalChangeRef.current = true; // Reset flag, but prevent re-emission
          return;
        }

        const currentCode = editor.getValue();
        const position = editor.getPosition();
        debounceCodeChange({ code: currentCode, position });
      };

      const disposable = editor.onDidChangeModelContent(handleContentChange);
      editor.onDidDispose(() => {
        disposable.dispose();
      });
    }
  }

  const debounceCodeChange = useRef(
    customDebounce(({ code, position }) => {
      socketRef.current?.emit('code-change', { code, position });
    }, 300)
  ).current;


  useEffect(() => {
    if (mode !== 'online') return;

    const socket = io(import.meta.env.VITE_API_BASE_URL);
    socketRef.current = socket;

    if (getSocket) {
      getSocket(socket);
      setsocketInitialized(true);
    }

    socket.emit('join-room', { roomId, username });

    socket.on('code-change', ({ code, position, userId }) => {
      if (editorRef.current) {
        const currentCode = editorRef.current.getValue();

        if (currentCode !== code) {
          isLocalChangeRef.current = false; // ✅ Prevent re-emission
          editorRef.current.setValue(code);
        }
      }
      if (userId !== socket.id) {
        // Move or create a fake cursor for other users
        showFakeCursor(userId, position);
      }
    });

    socket.on('init-code', (code) => {
      if (editorRef.current) {
        editorRef.current.setValue(code);
      } else {
        // Wait until editorRef is available
        const interval = setInterval(() => {
          if (editorRef.current) {
            editorRef.current.setValue(code);
            clearInterval(interval);
          }
        }, 100);
      }
    });

    return () => {
      if (socket) {
        socket.off('init-code');
        socket.off('code-change');
        socket.disconnect();
      }
    };
  }, [mode, roomId, username]);

  useEffect(() => {
    if (darkTheme) {
      monacoRef.current?.editor.setTheme("black-theme");
    } else {
      monacoRef.current?.editor.setTheme("vs");
    }
  }, [darkTheme]);

  function handlelanguagechange(lang) {
    setlanguage(lang);
    setopen(false);
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 flex items-center justify-between border-b border-gray-400">
        <button onClick={() => setopen(!open)} className='p-1 px-2 bg-zinc-900 border-2 border-gray-500 text-white rounded-lg font-bold'>{language}</button>
        <button onClick={() => setopenconsole(!Console)} className='p-1 px-2 bg-zinc-900 border-2 border-gray-500 text-white rounded-lg font-bold'>Console</button>
        {open && (
          <ul className='absolute mt-2 bg-zinc-800 border rounded shadow-md z-10 text-white'>
            {["javascript", "c++", "java", "python"].map((lang) => (
              <li
                key={lang}
                onClick={() => handlelanguagechange(lang)}
                className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
              >
                {lang}
                {(lang === 'java') ? ' (name you class as main)' : null}
              </li>
            ))}
          </ul>
        )}
        <Toggle darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
      </div>
      <div className="flex-grow h-0 mt-1">
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="cpp"
          defaultValue="// Write your code here"
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}
