/* Калькулятор задания № 6 и проверки основной формы. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var calculatorForm = document.getElementById("calculator-form");
  var productType = document.getElementById("prodType");
  var quantity = document.getElementById("prodQuantity");
  var radioBox = document.getElementById("radios");
  var checkboxBox = document.getElementById("checkboxes");
  var unitPriceOutput = document.getElementById("unitPrice");
  var totalPriceOutput = document.getElementById("prodPrice");
  var quantityError = document.getElementById("quantity-error");
  var result = document.getElementById("calculator-result");
  var money = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

  var prices = { "1": 762, "2": 545, "3": 67 };

  function calculate() {
    var type = productType.value;
    var unitPrice = prices[type];

    // Для цацек доступны радиокнопки с выбором обычного или золотого варианта.
    radioBox.hidden = type !== "2";
    // Для тугриков доступен чекбокс дополнительного свойства.
    checkboxBox.hidden = type !== "3";

    if (type === "2") {
      var selectedOption = document.querySelector('input[name="prodOptions"]:checked');
      if (selectedOption && selectedOption.value === "gold") unitPrice += 1000;
    }
    if (type === "3" && document.getElementById("prop-buuzy").checked) {
      unitPrice += 650;
    }

    unitPriceOutput.textContent = money.format(unitPrice) + " ₽";
    var count = Number(quantity.value);
    var validCount = quantity.value.trim() !== "" && Number.isInteger(count) && count >= 1 && Number.isSafeInteger(count);
    totalPriceOutput.textContent = validCount ? money.format(unitPrice * count) + " ₽" : "—";
    return { unitPrice: unitPrice, count: count, valid: validCount };
  }

  productType.addEventListener("change", function () {
    result.textContent = "";
    quantityError.textContent = "";
    quantity.removeAttribute("aria-invalid");
    calculate();
  });
  quantity.addEventListener("input", function () {
    result.textContent = "";
    quantityError.textContent = "";
    quantity.removeAttribute("aria-invalid");
    calculate();
  });
  document.querySelectorAll('input[name="prodOptions"]').forEach(function (radio) {
    radio.addEventListener("change", function () { result.textContent = ""; calculate(); });
  });
  document.getElementById("prop-buuzy").addEventListener("change", function () {
    result.textContent = "";
    calculate();
  });

  calculatorForm.addEventListener("submit", function (event) {
    event.preventDefault();
    result.textContent = "";
    var calculation = calculate();
    if (!calculation.valid || !Number.isSafeInteger(calculation.unitPrice * calculation.count)) {
      quantityError.textContent = "Введите целое положительное количество (не слишком большое).";
      quantity.setAttribute("aria-invalid", "true");
      quantity.focus();
      totalPriceOutput.textContent = "—";
      return;
    }
    quantityError.textContent = "";
    quantity.removeAttribute("aria-invalid");
    var details = "";
    if (productType.value === "2") {
      details = document.getElementById("option-gold").checked ? "Вариант: золотая." : "Вариант: обычная.";
    } else if (productType.value === "3" && document.getElementById("prop-buuzy").checked) {
      details = "Дополнительное свойство: буузы.";
    }
    result.textContent = "Заказ: " + productType.options[productType.selectedIndex].text.split(" — ")[0] + ", " + calculation.count + " шт." + (details ? " " + details : "") + " Итого: " + money.format(calculation.unitPrice * calculation.count) + " ₽.";
  });

  calculate();

  /* Проверки обязательной формы на исходной Bootstrap-странице. */
  var form = document.querySelector("#form form");
  if (!form) return;
  var fio = document.getElementById("fio");
  var phone = document.getElementById("phone");
  var birthdate = document.getElementById("birthdate");

  fio.addEventListener("input", function () {
    var value = this.value.trim();
    this.setCustomValidity(value !== "" && !/^[А-Яа-яЁёA-Za-z\s-]+$/u.test(value)
      ? "Введите ФИО буквами, без цифр и специальных символов." : "");
  });
  phone.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
    this.setCustomValidity(this.value !== "" && !/^\d+$/.test(this.value) ? "Введите только цифры." : "");
  });
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var dd = String(today.getDate()).padStart(2, "0");
  birthdate.max = yyyy + "-" + mm + "-" + dd;
  form.addEventListener("submit", function (event) {
    if (birthdate.value && birthdate.value > birthdate.max) {
      birthdate.setCustomValidity("Дата рождения не может быть в будущем.");
    } else {
      birthdate.setCustomValidity("");
    }
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
    }
  });
});
