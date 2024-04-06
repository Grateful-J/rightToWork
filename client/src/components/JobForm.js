import React, {useState} from 'react';

function JobForm({ onSave}) {
    const [jobName, setJobName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({jobName, location });
        //Reset Form
        setJobName('');
        setLocation('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                />
            </label>
            <label>
                Location:
                <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />
            </label>
            <button type="submit">Save Job</button>
        </form>
    );
}


export default JobForm;