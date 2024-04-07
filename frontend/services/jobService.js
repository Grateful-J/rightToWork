const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

async function fetchJobs() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/jobs`);
    const jobs = await response.json();
    return jobs;
  } catch (e) {
    console.error("Failed to fetch jobs", e);
  }
}

async function addJob(job) {
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
    } else {
      console.error("Failed to add job");
    }
  } catch (error) {
    console.error("Failed to add job", error);
  }
}


async function editJob(job){
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
    }
    catch (error) {
        console.error("Failed to update job", error);
    }
}

async deleteJob(job) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/jobs/${job._id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            console.log("Job deleted successfully");
        } else {
            console.error("Failed to delete job");
        }
    }    
    catch (error) {
        console.error("Failed to delete job", error);
    }
}
