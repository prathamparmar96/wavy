/* ================================
   WAVY — LOGIN & REGISTRATION
================================ */

document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".register-form");

    forms.forEach((form) => {
        const isRegistration = Boolean(form.querySelector("#fullname"));

        const nameInput = form.querySelector("#fullname");
        const usernameInput = form.querySelector("#username");
        const emailInput = form.querySelector("#email");
        const passwordInput = form.querySelector("#password");

        const submitButton = form.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        let submitted = false;

        /* ---------- Helpers ---------- */

        function getOrCreateMessage(input, className) {
            const wrapper = input.closest(".form-group") || input.parentElement;
            let message = wrapper.querySelector(`.${className}`);

            if (!message) {
                message = document.createElement("p");
                message.className = className;
                message.hidden = true;

                if (input.closest(".password-field")) {
                    input.closest(".password-field").insertAdjacentElement(
                        "afterend",
                        message
                    );
                } else {
                    input.insertAdjacentElement("afterend", message);
                }
            }

            return message;
        }

        function showMessage(input, messageElement, text) {
            messageElement.textContent = text;
            messageElement.hidden = !text;

            if (text) {
                input.setAttribute("aria-invalid", "true");
            } else {
                input.setAttribute("aria-invalid", "false");
            }
        }

        function clearMessage(input, messageElement) {
            messageElement.textContent = "";
            messageElement.hidden = true;
            input.removeAttribute("aria-invalid");
        }

        /* ---------- Full name ---------- */

        let nameMessage;

        if (nameInput) {
            nameMessage = getOrCreateMessage(nameInput, "error-message");
            nameMessage.hidden = true;

            function validateName() {
                const value = nameInput.value.trim();

                if (!value) {
                    showMessage(nameInput, nameMessage, "Enter your full name.");
                    return false;
                }

                if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
                    showMessage(
                        nameInput,
                        nameMessage,
                        "Use letters and spaces only. Example: Mahesh Shah."
                    );
                    return false;
                }

                clearMessage(nameInput, nameMessage);
                return true;
            }

            nameInput.addEventListener("input", () => {
                if (submitted || nameInput.value.trim()) {
                    validateName();
                } else {
                    clearMessage(nameInput, nameMessage);
                }
            });

            nameInput.addEventListener("blur", () => {
                if (nameInput.value.trim()) validateName();
            });
        }

        /* ---------- Username ---------- */

        let usernameMessages = [];

        if (usernameInput) {
            const checklist = document.createElement("ul");
            checklist.className = "username-checklist";
            checklist.hidden = true;

            const usernameRules = [
                {
                    text: "3–20 characters",
                    test: (value) => value.length >= 3 && value.length <= 20
                },
                {
                    text: "Letters, numbers, _ or . only",
                    test: (value) => /^[A-Za-z0-9_.]+$/.test(value)
                }
            ];

            usernameRules.forEach((rule) => {
                const item = document.createElement("li");
                item.className = "username-rule";

                const status = document.createElement("span");
                status.className = "rule-status";
                status.textContent = "Not yet";

                const text = document.createElement("span");
                text.textContent = rule.text;

                item.append(status, text);
                checklist.appendChild(item);

                usernameMessages.push({ item, status, rule });
            });

            usernameInput.insertAdjacentElement("afterend", checklist);

            function validateUsername() {
                const value = usernameInput.value.trim();

                if (!value) {
                    checklist.hidden = !submitted;
                    usernameInput.removeAttribute("aria-invalid");
                    usernameMessages.forEach(({ item, status }) => {
                        item.classList.remove("valid");
                        status.textContent = "Not yet";
                    });
                    return !submitted;
                }

                checklist.hidden = false;
                let allValid = true;

                usernameMessages.forEach(({ item, status, rule }) => {
                    const valid = rule.test(value);

                    item.classList.toggle("valid", valid);
                    status.textContent = valid ? "Done" : "Not yet";

                    if (!valid) allValid = false;
                });

                usernameInput.setAttribute(
                    "aria-invalid",
                    allValid ? "false" : "true"
                );

                return allValid;
            }

            usernameInput.addEventListener("input", validateUsername);
            usernameInput.addEventListener("blur", () => {
                if (usernameInput.value.trim()) validateUsername();
            });
        }

        /* ---------- Email ---------- */

        let emailMessage;

        if (emailInput) {
            emailMessage = getOrCreateMessage(emailInput, "error-message");
            emailMessage.hidden = true;

            function validateEmail() {
                const value = emailInput.value.trim();

                if (!value) {
                    showMessage(emailInput, emailMessage, "Enter your email address.");
                    return false;
                }

                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

                if (!emailPattern.test(value)) {
                    showMessage(
                        emailInput,
                        emailMessage,
                        "Enter a valid email address. Example: name@gmail.com."
                    );
                    return false;
                }

                clearMessage(emailInput, emailMessage);
                return true;
            }

            emailInput.addEventListener("input", () => {
                if (submitted || emailInput.value.trim()) {
                    validateEmail();
                } else {
                    clearMessage(emailInput, emailMessage);
                }
            });

            emailInput.addEventListener("blur", () => {
                if (emailInput.value.trim()) validateEmail();
            });
        }

        /* ---------- Password checklist ---------- */

        let passwordRules = [];
        let passwordStatus;

        if (passwordInput) {
            const passwordField = passwordInput.closest(".password-field");

            const checklist = document.createElement("ul");
            checklist.className = "password-checklist";
            checklist.hidden = true;

            const rules = [
                {
                    text: "At least 8 characters",
                    test: (value) => value.length >= 8
                },
                {
                    text: "One uppercase letter (A-Z)",
                    test: (value) => /[A-Z]/.test(value)
                },
                {
                    text: "One lowercase letter (a-z)",
                    test: (value) => /[a-z]/.test(value)
                },
                {
                    text: "One number (0-9)",
                    test: (value) => /[0-9]/.test(value)
                }
            ];

            rules.forEach((rule) => {
                const item = document.createElement("li");
                item.className = "password-rule";

                const status = document.createElement("span");
                status.className = "rule-status";
                status.textContent = "Not yet";

                const text = document.createElement("span");
                text.textContent = rule.text;

                item.append(status, text);
                checklist.appendChild(item);

                passwordRules.push({ item, status, rule });
            });

            passwordStatus = document.createElement("p");
            passwordStatus.className = "password-status";
            passwordStatus.hidden = true;

            if (passwordField) {
                passwordField.insertAdjacentElement("afterend", checklist);
                checklist.insertAdjacentElement("afterend", passwordStatus);
            } else {
                passwordInput.insertAdjacentElement("afterend", checklist);
                checklist.insertAdjacentElement("afterend", passwordStatus);
            }

            function validatePassword() {
                const value = passwordInput.value;

                if (!value) {
                    checklist.hidden = !submitted;
                    passwordStatus.hidden = true;
                    passwordInput.removeAttribute("aria-invalid");

                    passwordRules.forEach(({ item, status }) => {
                        item.classList.remove("valid");
                        status.textContent = "Not yet";
                    });

                    return !submitted;
                }

                checklist.hidden = false;
                let allValid = true;

                passwordRules.forEach(({ item, status, rule }) => {
                    const valid = rule.test(value);

                    item.classList.toggle("valid", valid);
                    status.textContent = valid ? "Done" : "Not yet";

                    if (!valid) allValid = false;
                });

                passwordStatus.hidden = true;
                passwordInput.setAttribute(
                    "aria-invalid",
                    allValid ? "false" : "true"
                );

                return allValid;
            }

            passwordInput.addEventListener("input", validatePassword);
            passwordInput.addEventListener("blur", () => {
                if (passwordInput.value) validatePassword();
            });
        }

        /* ---------- Show / hide password ---------- */

        form.querySelectorAll(".password-toggle").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const field = toggle.closest(".password-field");
                const input = field?.querySelector("input");

                if (!input) return;

                const showing = input.type === "password";
                input.type = showing ? "text" : "password";
                toggle.textContent = showing ? "Hide" : "Show";
                toggle.style.color = showing ? "var(--red)" : "var(--green)";
                toggle.setAttribute(
                    "aria-label",
                    showing ? "Hide password" : "Show password"
                );
            });
        });

        /* ---------- Enter moves to the next field ---------- */

        const fields = Array.from(
            form.querySelectorAll(
                'input:not([type="hidden"]):not([type="submit"]):not([disabled])'
            )
        );

        fields.forEach((field, index) => {
            field.addEventListener("keydown", (event) => {
                if (event.key !== "Enter") return;

                event.preventDefault();

                const nextField = fields[index + 1];

                if (nextField) {
                    nextField.focus();
                } else {
                    form.requestSubmit
                        ? form.requestSubmit()
                        : submitButton?.click();
                }
            });
        });

        /* ---------- Submit validation ---------- */

        form.noValidate = true;

        form.addEventListener("submit", (event) => {
            submitted = true;

            const checks = [];

            if (nameInput) checks.push(validateName());
            if (usernameInput) checks.push(validateUsername());
            if (emailInput) checks.push(validateEmail());
            if (passwordInput) checks.push(validatePassword());

            if (checks.some((valid) => !valid)) {
                event.preventDefault();

                const firstInvalid = form.querySelector(
                    'input[aria-invalid="true"]'
                );

                firstInvalid?.focus();
                return;
            }

            // Front-end validation only; no account is created without a backend.
            event.preventDefault();

            let message = form.querySelector(".success-message");

            if (!message) {
                message = document.createElement("p");
                message.className = "success-message";
                form.appendChild(message);
            }

            message.textContent = isRegistration
                ? "Your details are valid. Account creation is not connected yet."
                : "Your details are valid. Login is not connected yet.";
        });
    });
});