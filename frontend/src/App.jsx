import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <header className="text-center">
          <img src={logo} className="w-32 h-32 mx-auto animate-spin-slow" alt="logo" />
          <p className="mt-4 text-gray-700 text-lg">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.js</code> and save to reload.
          </p>
          <a
            className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </div>
  );
}

export default App;
