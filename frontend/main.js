import "./style.css";
import "./utils/states";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${apiBaseUrl}/api/jobs`);
const validStates = import.meta.env.VITE_VALID_STATES.split(",").map((state) => state.trim());//creates array of valid states from imported states.js

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
    //travelDays: document.querySelector("#travelDays").value,
    //isRTW: document.querySelector("#isRTW").checked,
  };

  try {
    const response = await fetch(`${apiBaseUrl}/api/jobs`, {
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
    const response = await fetch(`${apiBaseUrl}/api/jobs`);
    const jobs = await response.json();
    displayJobs(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }
}

//displays counter of Right to Work days
function updateCounters(jobs) {
  let rtwDays = 0;
  let nonRtwDays = 0;

  jobs.forEach((job) => {
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (job.isRTW) {
      rtwDays += days;
    } else {
      nonRtwDays += days;
    }
  });

  document.getElementById("rtw-counter").textContent = `RTW Days: ${rtwDays}`;
  document.getElementById(
    "non-rtw-counter"
  ).textContent = `Non-RTW Days: ${nonRtwDays}`;
}

//displays job and adds styling using tailwind CSS
function displayJobs(jobs) {
  const container = document.querySelector("#jobs-container");
  container.innerHTML = ""; // Clear existing jobs

  jobs.forEach((job) => {
    const row = container.insertRow();
    row.innerHTML = `
      <td>${job.jobName}</td>
      <td>${job.client}</td>
      <td>${job.location}</td>
      <td>${new Date(job.startDate).toLocaleDateString()}</td>
      <td>${new Date(job.endDate).toLocaleDateString()}</td>
      <td>${job.isRTW ? "Yes" : "No"}</td>
    `;
  });

  updateCounters(jobs);
}
