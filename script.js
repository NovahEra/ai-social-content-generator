// Simple form submission demo
document.getElementById("contentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("✅ Thank you! Your 5 free posts are on the way to your inbox.");
  // In real app: send to backend or email service
});
