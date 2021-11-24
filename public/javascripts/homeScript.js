const el = document.getElementById("logoutA");
if (el) {
    el.addEventListener("click", () => {
        confirm("Ви дійсно хочете вийти з акаунту?") ?
        fetch("http://localhost:8080/auth/login/logout", {method: "POST"}) :
        location.href = window.location.href;
    });
};
