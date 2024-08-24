const addBtn = document.querySelector(".add");
const dialog = document.querySelector('.dialog_list');
const themeBtn = document.querySelector(".theme");
const theme_selector = document.querySelector(".theme_selector");
const close_theme = document.querySelector("#close_theme");
const close_add = document.querySelector("#close");
const theme_buttons = document.querySelectorAll(".th");
const themeNumber = document.getElementById('theme_number')

console.log(dialog)
addBtn.addEventListener("click", function(){
dialog.showModal();
close_add.addEventListener("click", () => {
    close_add.parentNode.close();
});
themeBtn.addEventListener("click", function() {
    theme_selector.showModal();
    theme_buttons.forEach(function(elem){
    elem.addEventListener("click", () => {
        console.log(themeNumber.value)
        themeNumber.value = Number(elem.className.substring(8))
        themeBtn.className = "dialog_btn theme" + " " + elem.className.substring(3);
        close_theme.parentNode.close();
    });
    });
    close_theme.addEventListener("click", () => {
    close_theme.parentNode.close();
    });
});
});