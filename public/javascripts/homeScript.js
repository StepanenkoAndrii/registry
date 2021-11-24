const el = document.getElementById("logoutA");
el.addEventListener("click", () => {
    console.log("here");
    confirm("Ви дійсно хочете вийти з акаунту?") ?
        // location.href = "http://localhost:8080/auth/login/logout" :
        console.log(window.location.href) :
        location.href = window.location.href;
});