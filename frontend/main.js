import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  fetchJobs();
});

async function fetchJobs() {
  try {
    const response = await fetch("/api/jobs");
    const jobs = await response.json();
    displayJobs(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }
}

function displayJobs(jobs) {
  const container = document.querySelector("#jobs-container");
  container.innerHTML = '', //clear exisiting jobs
  jobs.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.innerHTML = `
      <h3>${job.jobName}</h3>
      <p>Client: ${job.client}</p>
      <p>Location: ${job.location}</p>
      <p>Start Date: ${job.startDate}</p>
      <p>End Date: ${job.endDate}</p>
      <p>Travel Days: ${job.travelDays}</p>
      <p>RTW: ${job.isRTW ? "Yes" : "No"}</p>
    `;
    container.appendChild(jobDiv);
  });
}
