document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("item-name").value;
    const type = document.getElementById("item-type").value;
    const quantity = document.getElementById("quantity").value;

    const table = document.getElementById("inventory-table");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${name}</td>
      <td>${type}</td>
      <td>${quantity}</td>
    `;

    table.appendChild(row);
    this.reset();
  });
});
