import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  fetchJobs();
});

document.querySelector("#job-form").addEventListener("submit", addJob);

async function addJob(event) {
  event.preventDefault();

  const job = {
    jobName: document.querySelector("#jobName").value,
    client: document.querySelector("#client").value,
    location: document.querySelector("#location").value,
    startDate: document.querySelector("#startDate").value,
    endDate: document.querySelector("#endDate").value,
    travelDays: document.querySelector("#travelDays").value,
    isRTW: document.querySelector("#isRTW").checked,
  };

  try {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (response.ok) {
      console.log("Job added successfully");
      fetchJobs();
    } else {
      console.error("Failed to add job");
    }
    } catch (error) {
      console.error("Failed to add job", error);
    }
  }

async function fetchJobs() {
  try {
    const response = await fetch("/api/jobs");
    const jobs = await response.json();
    displayJobs(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }
}

//displays job and adds styling using tailwind CSS
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
