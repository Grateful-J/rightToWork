import react, { useEffect, useState } from "react";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Failed to fetch jobs", error));
  }, []);

  return (
    <div>
      <h2>Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.jobName} - {job.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;
