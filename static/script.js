document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/users") // Use relative path
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No users found.");
        return;
      }
      
      const tableBody = document.getElementById("user-table");
      tableBody.innerHTML = ""; // Clear existing data

      data.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.email}</td>
          <td>${user.number}</td>
          <td>${user.gender}</td>
          <td>${user.name}</td>
          <td>${user.role}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching data:", error));
});
