import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import axios from 'axios';

export default function Collections() {
  const [spinner, setSpinner] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [openDocId, setOpenDocId] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/get-collections`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });
        if (response.data.statusCode === 200) {
          setDocuments(response.data.data);
        } else {
          console.error('Error fetching documents:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setSpinner(false);
      }
    };

    fetchDocuments();
  }, []);

  if (spinner) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Your Collections</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto"> {/* Scrollable container */}
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left">S.No</th>
                <th className="px-6 py-3 text-left">Document Name</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center">No documents found.</td>
                </tr>
              ) : (
                documents.map((doc, index) => (
                  <React.Fragment key={doc._id}>
                    <tr className="border-t">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{doc.title}</td>
                      <td className="px-6 py-4">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                          onClick={() => {
                            setOpenDocId(openDocId === doc._id ? null : doc._id);
                          }}
                        >
                          {openDocId === doc._id ? 'Hide' : 'Open'}
                        </button>
                      </td>
                    </tr>
                    {openDocId === doc._id && (
                      <tr className="border-b bg-gray-50">
                        <td colSpan="3" className="px-6 py-4 text-sm text-white bg-slate-950 whitespace-pre-wrap">
                          {doc.content}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
