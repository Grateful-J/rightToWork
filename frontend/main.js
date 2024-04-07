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
