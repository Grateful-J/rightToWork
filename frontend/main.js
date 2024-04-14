import "./style.css";
import "./utils/states";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//const response = await fetch(`${apiBaseUrl}/api/jobs`);

//Global variable for jobs
let globalJobs = [];

//Global variable to track the editing state
let isEditing = false;
let editingJobID = "";

//On page load fetch jobs & listens for form submit
fetchJobs();
document.querySelector("#job-form").addEventListener("submit", addorUpdateJob); // Event Listener For on submit to addJob or updateJob

// Event Listener for Edits or Deletes
document.querySelector("#jobs-container").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const jobId = event.target.getAttribute("data-id");
    deleteJob(jobId);
  } else if (event.target.classList.contains("edit-btn")) {
    const jobId = event.target.getAttribute("data-id");
    const job = globalJobs.find((job) => job._id === jobId);
    editJob(job);
  }
});

// Add minimum value to endDate based on startDate
document.querySelector("#startDate").addEventListener("change", () => {
  const startDate = document.querySelector("#startDate").value;
  const endDate = document.querySelector("#endDate");
  endDate.min = startDate;
});

async function addorUpdateJob(event) {
  event.preventDefault();

  // Check if state is valid
  const locationInput = document.querySelector("#location").value;
  const isValidState = Array.from(document.querySelector("#states-datalist").options).some((option) => option.value === locationInput);

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
    //TODO: travelDays: document.querySelector("#travelDays").value,
    //TODO: isRTW: document.querySelector("#isRTW").checked,
  };

  let url = `${apiBaseUrl}/api/jobs`;
  let method = "POST";
  if (isEditing) {
    url = `${apiBaseUrl}/api/jobs/${editingJobID}`;
    method = "PATCH";
  }

  // Add or update job to database
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (response.ok) {
      console.log(isEditing ? "Job updated" : "Job added");
      resetForm();
      fetchJobs();
    } else {
      console.error(isEditing ? "Failed to update job" : "Failed to add job");
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
    console.log(`fetched jobs: ${globalJobs[0]}`);
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
  document.getElementById("non-rtw-counter").textContent = `Non-RTW Days: ${nonRtwDays}`;
}

// Delete Job
async function deleteJob(jobId) {
  //Ask user if confirm delete
  const isDeleteConfirmed = confirm("Are you sure you want to delete this job?");
  if (!isDeleteConfirmed) {
    return; // Exit the function if user cancels
  }

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
    const daysWorked = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const row = container.insertRow();
    row.innerHTML = `
  <td class="border-b border-gray-200 p-2">${job.jobName}</td>
  <td class="border-b border-gray-200 p-2">${job.client}</td>
  <td class="border-b border-gray-200 p-2">${job.location}</td>
  <td class="border-b border-gray-200 p-2">${new Date(job.startDate).toLocaleDateString()}</td>
  <td class="border-b border-gray-200 p-2">${new Date(job.endDate).toLocaleDateString()}</td>
  <td class="border-b border-gray-200 p-2">${job.isRTW ? "Yes" : "No"}</td>
  <td class="border-b border-gray-200 p-2">${daysWorked}</td>
  <td class="border-b border-gray-200 p-2"><button class="edit-btn" data-id="${job._id}">Edit</button></td>
  <td class="border-b border-gray-200 p-2"><button class="delete-btn" data-id="${job._id}">Delete</button></td>
`;
  });

  updateCounters(jobs);
}

//Edit Job
async function editJob(job) {
  //Change submit button text to "Update Job"
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.textContent = "Update Job";

  const startDate = new Date(job.startDate);
  const isoFormattedStartDate = startDate.toISOString().split("T")[0];
  const endDate = new Date(job.endDate);
  const isoFormattedEndDate = endDate.toISOString().split("T")[0];

  //Populates the form with job data
  document.querySelector("#jobName").value = job.jobName;
  document.querySelector("#client").value = job.client;
  document.querySelector("#location").value = job.location;
  document.querySelector("#startDate").value = isoFormattedStartDate;
  document.querySelector("#endDate").value = isoFormattedEndDate;
  //document.querySelector("#travelDays").value = job.travelDays;
  //document.querySelector("#isRTW").checked = job.isRTW;

  //Set editing state
  isEditing = true;
  editingJobID = job._id;

  //Snap to top of window
  window.scrollTo(0, 0);
}
//Reset Form
function resetForm() {
  document.querySelector("#job-form").reset();
  isEditing = false;
  editingJobID = "";

  //Change submit button back to "Add Job"
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.textContent = "Add Job";
}

//TODO: Hide delete unless in edit mode

//TODO:Move JS job functions to new module

//TODO: look into better state management for "edit mode"

//TODO: import code from mapsBasic.js and utilize autocomeplete for location field

//TODO: GET all locations

//TODO: add user login

//TODO: add user logout

//TODO: add user registration

//TODO: add user profile

//TODO: add user profile edit

//TODO: add user reset password

//TODO: add user forgot password

//TODO: add user change password

//TODO: add toggle for isFreelance? / applies to NABET rule set

//TODO: add labor tracking module

//TODO: Labor > Create formula for 10 Hour Day (minimum)
//TODO: Labor > Create formula for 8 Hour Day (CA rate)

//TODO: Labor > Create OT formula (hours 10 - 12 1.5x Rate)
//TODO: Labor > Create formula for DT formulat (Hours 12+ 2x Rate)

//TODO:create Labor API
//TODO: add option to assign rate to client
//TODO: add editing mode for labor
//TODO: create expenses tracker
//TODO: create expenses API
//TODO: create expenses UI
