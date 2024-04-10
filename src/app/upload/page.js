'use client'
import { useState } from 'react';

const Page = () => {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !file) {
      setOutput('Please provide both username and file');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('file', file);

    try {
      setOutput('Uploading file...');

      const response = await fetch('http://localhost:3500/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {   
        throw new Error('Failed to upload file');
      }
      const data = await response.text(); // Convert the response to text
      
      setOutput(data === 'true' ? 'File uploaded successfully \n Server working' : 'File upload failed \nServer working');
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error occurred while uploading file.\nServer not working');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full py-8 px-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-4">Upload PDF</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-customPink hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            
          >
            Submit
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Output</h3>
          <textarea
            value={output}
            readOnly
            className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-auto"
            rows={6}
            placeholder="Response will appear here"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
