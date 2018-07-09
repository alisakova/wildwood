var inputs = document.querySelectorAll(".checkbox > input");

inputs.forEach(function(input) {
  input.addEventListener("change", function(e) {
    var item = e.target.closest(".form__item");
    var descr = item.querySelector(".form__descr");
    var allDescr = document.querySelectorAll(".form__descr");
    allDescr.forEach(function(item) {
      item.classList.remove("active");
      descr.classList.add("active");
    });
  });
});
