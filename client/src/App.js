import React from 'react';
//import './App.css'; // Keeps the default styling
// Import your custom styles
import './styles.css';

import JobList from './components/JobList';
import JobForm from './components/JobForm';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Job Tracker</h1>
            </header>
            <main>
                <JobForm onSave={job => console.log(job)} />
                <JobList />
            </main>
        </div>
    );
}

export default App;
