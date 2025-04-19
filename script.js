
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-section").forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      content.classList.toggle("hidden");
    });
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("section").forEach(section => {
      const text = section.innerText.toLowerCase();
      section.style.display = text.includes(query) ? "block" : "none";
    });
  });
});
