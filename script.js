document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-section").forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      content.classList.toggle("hidden");
      button.classList.toggle("active");
    });
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  // Enhanced search functionality with text highlighting
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      
      // First, remove any existing highlights
      removeHighlights();
      
      // If search is empty, show all sections and return
      if (query === "") {
        document.querySelectorAll("section").forEach(section => {
          section.style.display = "block";
        });
        return;
      }
      
      document.querySelectorAll("section").forEach(section => {
        // Store original content if not already stored
        if (!section.hasAttribute("data-original")) {
          section.setAttribute("data-original", section.innerHTML);
        }
        
        // Reset to original content before searching again
        section.innerHTML = section.getAttribute("data-original");
        
        // Get all text including hidden content
        const sectionContent = section.textContent || section.innerText;
        const text = sectionContent.toLowerCase();
        
        // Check if the section contains the search query
        if (text.includes(query)) {
          section.style.display = "block";
          
          // Expand sections that match the search
          const toggleButton = section.querySelector(".toggle-section");
          const content = toggleButton ? toggleButton.nextElementSibling : null;
          
          if (content && content.classList.contains("hidden")) {
            content.classList.remove("hidden");
            if (toggleButton) toggleButton.classList.add("active");
          }
          
          // Highlight the matching text
          highlightText(section, query);
        } else {
          section.style.display = "none";
        }
      });
    });
    
    // Clear highlights when search is cleared
    searchInput.addEventListener("blur", () => {
      if (searchInput.value.trim() === "") {
        removeHighlights();
      }
    });
  } else {
    console.error("Search input element not found. Make sure you have an element with id 'searchInput'.");
  }
  
  // Function to highlight text
  function highlightText(element, query) {
    // Skip button elements and their children
    const buttons = element.querySelectorAll("button");
    buttons.forEach(button => button.setAttribute("data-skip-highlight", "true"));
    
    highlightNode(element, query);
    
    // Remove the skip attribute
    buttons.forEach(button => button.removeAttribute("data-skip-highlight"));
  }
  
  // Recursive function to highlight text in nodes
  function highlightNode(node, query) {
    // Skip nodes marked to be skipped
    if (node.getAttribute && node.getAttribute("data-skip-highlight") === "true") {
      return;
    }
    
    if (node.nodeType === 3) { // Text node
      const text = node.nodeValue.toLowerCase();
      const index = text.indexOf(query);
      
      if (index >= 0) {
        // Create a highlighted span
        const span = document.createElement("span");
        span.className = "search-highlight";
        
        // Split the text node into parts
        const before = node.nodeValue.substring(0, index);
        const match = node.nodeValue.substring(index, index + query.length);
        const after = node.nodeValue.substring(index + query.length);
        
        // Create text nodes for before and after
        const beforeNode = document.createTextNode(before);
        const matchNode = document.createTextNode(match);
        const afterNode = document.createTextNode(after);
        
        // Add the matched text to the highlighted span
        span.appendChild(matchNode);
        
        // Replace the original node with the new nodes
        const parent = node.parentNode;
        parent.insertBefore(beforeNode, node);
        parent.insertBefore(span, node);
        parent.insertBefore(afterNode, node);
        parent.removeChild(node);
        
        // Continue highlighting in the "after" part
        if (after.toLowerCase().includes(query)) {
          highlightNode(afterNode, query);
        }
      }
    } else if (node.nodeType === 1) { // Element node
      // Skip script and style elements
      if (node.tagName.toLowerCase() !== "script" && 
          node.tagName.toLowerCase() !== "style") {
        Array.from(node.childNodes).forEach(child => {
          highlightNode(child, query);
        });
      }
    }
  }
  
  // Function to remove all highlights
  function removeHighlights() {
    document.querySelectorAll("section").forEach(section => {
      if (section.hasAttribute("data-original")) {
        section.innerHTML = section.getAttribute("data-original");
      }
    });
  }
});
