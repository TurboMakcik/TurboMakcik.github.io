"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("feedback-modal");
  const form = document.getElementById("feedback-form");

  if (!modal || !form) return;

  const storageKey = "siteFeedbackDraft";
  const status = document.getElementById("feedback-status");
  const submitButton = document.getElementById("feedback-submit");

  // Вставьте сюда URL своей формы Formcarry
  const FORM_ENDPOINT = "https://formcarry.com/s/_jAfyKZnv4M";

  let previouslyFocused = null;

  // Вывод сообщений
  function setStatus(message, type) {
    status.textContent = message;
    status.className =
      "feedback-status mt-3" + (type ? " is-" + type : "");
  }

  // Получение данных формы
  function getFormData() {
    const data = {};

    Array.from(form.elements).forEach(function (field) {
      if (!field.name) return;

      data[field.name] =
        field.type === "checkbox"
          ? field.checked
          : field.value;
    });

    return data;
  }

  // Сохранение черновика
  function saveDraft() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(getFormData())
      );
    } catch (error) {
      console.warn("Не удалось сохранить черновик");
    }
  }

  // Восстановление черновика
  function restoreDraft() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;

      const data = JSON.parse(saved);

      Array.from(form.elements).forEach(function (field) {
        if (!field.name || !(field.name in data)) return;

        if (field.type === "checkbox") {
          field.checked = Boolean(data[field.name]);
        } else {
          field.value = data[field.name];
        }
      });
    } catch (error) {
      console.warn("Не удалось восстановить черновик");
    }
  }

  // Открытие окна
  function openModal() {
    if (!modal.hidden) return;

    previouslyFocused = document.activeElement;

    restoreDraft();

    modal.hidden = false;
    document.body.classList.add("feedback-modal-open");

    history.pushState(
      { feedbackModal: true },
      "",
      "#feedback-modal"
    );

    document.getElementById("feedback-name").focus();
  }

  // Закрытие окна
  function hideModal() {
    if (modal.hidden) return;

    saveDraft();

    modal.hidden = true;
    document.body.classList.remove("feedback-modal-open");

    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }

  // Закрытие через кнопку или кнопку «Назад»
  function closeModal() {
    if (!modal.hidden) {
      history.back();
    }
  }

  // Кнопки открытия
  document.querySelectorAll("[data-feedback-open]")
    .forEach(function (button) {
      button.addEventListener("click", openModal);
    });

  // Кнопки закрытия
  document.querySelectorAll("[data-feedback-close]")
    .forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

  // Закрытие при клике по затемнённому фону
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Закрытие клавишей Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  // Обработка кнопки «Назад» браузера
  window.addEventListener("popstate", function () {
    hideModal();
  });

  // Автоматическое сохранение черновика
  form.addEventListener("input", saveDraft);
  form.addEventListener("change", saveDraft);

  // Отправка формы
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!FORM_ENDPOINT.startsWith("https://formcarry.com/s/")) {
      setStatus(
        "Сначала укажите URL формы Formcarry в feedback.js.",
        "error"
      );
      return;
    }

    submitButton.disabled = true;
    setStatus("Отправка сообщения...", "");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: new FormData(form)
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки");
      }

      localStorage.removeItem(storageKey);
      form.reset();

      setStatus(
        "Спасибо! Сообщение успешно отправлено.",
        "success"
      );

    } catch (error) {
      setStatus(
        "Не удалось отправить сообщение. Проверьте подключение и попробуйте ещё раз.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  });
});