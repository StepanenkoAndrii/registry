const el = document.getElementById("logoutA");
el.addEventListener("click", () => {
    confirm("Ви дійсно хочете вийти з акаунту?") ?
        location.href = "http://localhost:8080/auth/login/logout" :
        location.href = window.location.href;
});