document.addEventListener("DOMContentLoaded", function () {
  const rowsPerPage = 8;
  const table = document.querySelector(".table tbody");
  const rows = Array.from(table.rows);
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const pagination = document.getElementById("pagination");
  function displayPage(page) {
    rows.forEach((row, index) => {
      row.style.display =
        index >= (page - 1) * rowsPerPage && index < page * rowsPerPage
          ? ""
          : "none";
    });
    pagination.innerHTML = `
<li class="page-item ${page === 1 ? "disabled" : ""}">
  <a class="page-link" href="#" onclick="changePage(${page - 1})">&laquo;</a>
</li>
`;
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
<li class="page-item ${i === page ? "active" : ""}">
  <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
</li>
`;
    }
    pagination.innerHTML += `
<li class="page-item ${page === totalPages ? "disabled" : ""}">
  <a class="page-link" href="#" onclick="changePage(${page + 1})">&raquo;</a>
</li>
`;
  }
  window.changePage = function (page) {
    if (page >= 1 && page <= totalPages) displayPage(page);
  };
  displayPage(1);
});
