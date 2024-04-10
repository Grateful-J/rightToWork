import "./style.css";
import "./utils/states";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${apiBaseUrl}/api/jobs`);

//Global variable for jobs
let globalJobs = [];

//Global variable to track the editing state
let isEditing = false;
let editingJobID = "";

console.log("Has it Loaded Yet?");
fetchJobs();
document.querySelector("#job-form").addEventListener("submit", addJob);

// Add Event Listener For on click delete to deleteJob

document.querySelector("#jobs-container").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const jobId = event.target.getAttribute("data-id");
    deleteJob(jobId);
  }
});

// Add minimum value to endDate based on startDate
document.querySelector("#startDate").addEventListener("change", () => {
  const startDate = document.querySelector("#startDate").value;
  const endDate = document.querySelector("#endDate");
  endDate.min = startDate;
});

async function addJob(event) {
  event.preventDefault();

  // Check if state is valid
  const locationInput = document.querySelector("#location").value;
  const isValidState = Array.from(
    document.querySelector("#states-datalist").options
  ).some((option) => option.value === locationInput);

  if (!isValidState) {
    alert("Please enter a valid state");
    return;
  }

  // Get values from form
  const job = {
    jobName: document.querySelector("#jobName").value,
    client: document.querySelector("#client").value,
    location: document.querySelector("#location").value,
    startDate: document.querySelector("#startDate").value,
    endDate: document.querySelector("#endDate").value,
    //travelDays: document.querySelector("#travelDays").value,
    //isRTW: document.querySelector("#isRTW").checked,
  };

  // Add job to database
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

//GET all jobs
async function fetchJobs() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/jobs`);
    const jobs = await response.json();
    globalJobs = jobs; //update global variable
    displayJobs(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }
}

//Displays Counter of Right to Work days
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

// Delete Job
async function deleteJob(jobId) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/jobs/${jobId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Job deleted successfully");
      fetchJobs(); // Re-fetch jobs to update the list
    } else {
      console.error("Failed to delete job");
    }
  } catch (error) {
    console.error("Failed to delete job", error);
  }
}

//Display Jobs
function displayJobs(jobs) {
  const container = document.querySelector("#jobs-container");
  container.innerHTML = ""; // Clear existing jobs

  jobs.forEach((job) => {
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);
    const daysWorked =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const row = container.insertRow();
    row.innerHTML = `
      <td>${job.jobName}</td>
      <td>${job.client}</td>
      <td>${job.location}</td>
      <td>${new Date(job.startDate).toLocaleDateString()}</td>
      <td>${new Date(job.endDate).toLocaleDateString()}</td>
      <td>${job.isRTW ? "Yes" : "No"}</td>
      <td>${daysWorked}</td>
      <td><button class="edit-btn">Edit</button></td>
      <td><button class="delete-btn" data-id="${job._id}">Delete</button></td>
    `;
  });

  updateCounters(jobs);
}

//Edit Job
async function editJob(job) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/jobs/${job._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    if (response.ok) {
      console.log("Job updated successfully");
    } else {
      console.error("Failed to update job");
    }
  } catch (error) {
    console.error("Failed to update job", error);
  }
}

