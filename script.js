
/* =================================
   WAVY — LOGIN & REGISTRATION
================================= */

document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll(".register-form");

    forms.forEach(form => {

        form.noValidate = true;

        const nameInput = form.querySelector("#fullname");
        const usernameInput = form.querySelector("#username");
        const emailInput = form.querySelector("#email");
        const passwordInput = form.querySelector("#password");

        const isRegistration = Boolean(nameInput && usernameInput);

        const formMessage = form.querySelector(".form-message");

        let submitted = false;

        const touched = new Set();

        /* COMMON HELPERS */

        function setError(input, message) {
            if (!input) return false;

            const error = document.getElementById(input.id + "Error");

            if (error) {
                error.textContent = message;
                error.hidden = !message;
            }

            if (message) {
                input.setAttribute("aria-invalid", "true");
                return false;
            }

            input.removeAttribute("aria-invalid");
            return true;
        }

        function showMessage(message, isError = false) {
            if (!formMessage) return;

            formMessage.textContent = message;
            formMessage.hidden = false;
            formMessage.classList.toggle("error", isError);
        }

        function clearMessage() {
            if (!formMessage) return;

            formMessage.textContent = "";
            formMessage.hidden = true;
            formMessage.classList.remove("error");
        }

        function markTouched(input) {
            if (input) touched.add(input.id);
        }

        /* FULL NAME */

        function validateName() {
            const value = nameInput.value.trim();

            const valid =
                /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u.test(value);

            let message = "";

            if (!value) {
                message = "Enter your full name.";
            } else if (!valid) {
                message = "Use letters and spaces only.";
            }

            return setError(nameInput, valid ? "" : message);
        }

        /* USERNAME RULES */

        const usernameRules = [
            {
                id: "length",
                test: value => value.length >= 3 && value.length <= 20
            },
            {
                id: "characters",
                test: value => /^[A-Za-z0-9_.]+$/.test(value)
            },
            {
                id: "dots",
                test: value =>
                    !value.startsWith(".") &&
                    !value.endsWith(".") &&
                    !value.includes("..")
            }
        ];

        function validateUsername() {
            const value = usernameInput.value;
            const checklist = document.getElementById("usernameRules");

            if (!checklist) return false;

            if (!value && !submitted && !touched.has("username")) {
                checklist.hidden = true;
                setError(usernameInput, "");
                return false;
            }

            checklist.hidden = !value;

            let allValid = true;

            usernameRules.forEach(rule => {
                const item = checklist.querySelector(
                    `[data-rule="${rule.id}"]`
                );

                if (!item) return;

                const status = item.querySelector(".rule-status");
                const valid = rule.test(value);

                item.classList.toggle("valid", valid);

                if (status) {
                    status.textContent = valid ? "✅" : "❌";
                }

                if (!valid) allValid = false;
            });

            if (!value) {
                setError(usernameInput, "Enter a username.");
                return false;
            }

            if (!allValid) {
                setError(
                    usernameInput,
                    "Please follow all username requirements."
                );
                return false;
            }

            setError(usernameInput, "");
            return true;
        }

        /* EMAIL VALIDATION */

        function validateEmail() {
            const value = emailInput.value.trim();

            const emailPattern =
                /^(?!.*\.\.)[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

            let message = "";

            if (!value) {
                message = "Enter your email address.";
            } else if (!value.includes("@")) {
                message = "Add @ to your email address.";
            } else if (!emailPattern.test(value)) {
                message = "Enter a valid email address.";
            }

            return setError(emailInput, message);
        }

        /* PASSWORD RULES */

        const passwordRules = [
            {
                id: "length",
                test: value => value.length >= 8
            },
            {
                id: "uppercase",
                test: value => /[A-Z]/.test(value)
            },
            {
                id: "lowercase",
                test: value => /[a-z]/.test(value)
            },
            {
                id: "number",
                test: value => /[0-9]/.test(value)
            },
            {
                id: "special",
                test: value => /[^A-Za-z0-9\s]/.test(value)
            }
        ];

        /* PASSWORD CHECKLIST */

        function updatePasswordChecklist() {
            const value = passwordInput.value;
            const checklist = document.getElementById("passwordRules");

            if (!checklist) return 0;

            checklist.hidden = !value;

            let score = 0;

            passwordRules.forEach(rule => {
                const item = checklist.querySelector(
                    `[data-rule="${rule.id}"]`
                );

                if (!item) return;

                const status = item.querySelector(".rule-status");
                const valid = rule.test(value);

                item.classList.toggle("valid", valid);

                if (status) {
                    status.textContent = valid ? "✅" : "❌";
                }

                if (valid) score++;
            });

            return score;
        }

        /* PASSWORD STRENGTH — BOTH PAGES */

        function updatePasswordStrength(score, value) {

            const strengthBox =
                document.getElementById("passwordStrength");

            const strengthFill =
                document.getElementById("strengthFill");

            const strengthLabel =
                document.getElementById("strengthLabel");

            if (!strengthBox || !strengthFill || !strengthLabel) return;

            if (!value) {
                strengthBox.hidden = true;
                strengthFill.style.width = "0%";
                strengthFill.className = "strength-fill";
                strengthLabel.textContent = "";
                return;
            }

            strengthBox.hidden = false;
            strengthFill.className = "strength-fill";

            if (score <= 2) {

                strengthFill.classList.add("weak");
                strengthFill.style.width =
                    `${Math.max(score, 1) * 20}%`;

                strengthLabel.textContent = "Weak password";

            } else if (score <= 4) {

                strengthFill.classList.add("fair");
                strengthFill.style.width = `${score * 20}%`;

                strengthLabel.textContent = "Fair password";

            } else {

                strengthFill.classList.add("strong");
                strengthFill.style.width = "100%";

                strengthLabel.textContent = "Strong password";
            }
        }

        /* PASSWORD VALIDATION */

        function validatePassword() {
            const value = passwordInput.value;

            if (!value) {

                if (submitted || touched.has("password")) {
                    setError(passwordInput, "Enter your password.");
                } else {
                    setError(passwordInput, "");
                }

                updatePasswordChecklist();
                updatePasswordStrength(0, "");

                return false;
            }

            const score = updatePasswordChecklist();

            // Strength meter updates on BOTH Login and Registration
            updatePasswordStrength(score, value);

            // Registration requires all 5 password rules
            if (isRegistration) {

                if (score !== passwordRules.length) {
                    setError(
                        passwordInput,
                        "Complete all password requirements."
                    );

                    return false;
                }
            }

            /*
              Login checklist is informational.
              Existing passwords are not blocked by new rules.
            */

            setError(passwordInput, "");
            return true;
        }

        /* SHOW / HIDE PASSWORD */

        const toggle = form.querySelector(".password-toggle");

        if (toggle) {

            toggle.addEventListener("click", () => {

                const showing = passwordInput.type === "password";

                passwordInput.type = showing ? "text" : "password";

                toggle.textContent = showing ? "Hide" : "Show";

                toggle.setAttribute(
                    "aria-pressed",
                    String(showing)
                );

                toggle.setAttribute(
                    "aria-label",
                    showing ? "Hide password" : "Show password"
                );
            });
        }

        /* FULL NAME EVENTS */

        if (nameInput) {

            nameInput.addEventListener("input", () => {

                clearMessage();

                if (touched.has("fullname") || submitted) {
                    validateName();
                }
            });

            nameInput.addEventListener("blur", () => {

                if (nameInput.value.trim() || submitted) {
                    markTouched(nameInput);
                    validateName();
                }
            });
        }

        /* USERNAME EVENTS */

        if (usernameInput) {

            usernameInput.addEventListener("input", () => {

                clearMessage();

                if (
                    usernameInput.value ||
                    touched.has("username") ||
                    submitted
                ) {
                    validateUsername();
                }
            });

            usernameInput.addEventListener("blur", () => {

                if (usernameInput.value || submitted) {
                    markTouched(usernameInput);
                    validateUsername();
                }
            });
        }

        /* EMAIL EVENTS */

        emailInput.addEventListener("input", () => {

            clearMessage();

            if (touched.has("email") || submitted) {
                validateEmail();
            }
        });

        emailInput.addEventListener("blur", () => {

            if (emailInput.value.trim() || submitted) {
                markTouched(emailInput);
                validateEmail();
            }
        });

        /* PASSWORD EVENTS */

        passwordInput.addEventListener("input", () => {

            clearMessage();

            if (
                passwordInput.value ||
                touched.has("password") ||
                submitted
            ) {
                validatePassword();
            }
        });

        passwordInput.addEventListener("blur", () => {

            if (passwordInput.value || submitted) {
                markTouched(passwordInput);
                validatePassword();
            }
        });

        /* ENTER KEY NAVIGATION */

        const fields = Array.from(
            form.querySelectorAll(
                'input:not([type="hidden"]):not([disabled])'
            )
        );

        fields.forEach((field, index) => {

            field.addEventListener("keydown", event => {

                if (event.key !== "Enter") return;

                event.preventDefault();

                if (index < fields.length - 1) {

                    fields[index + 1].focus();

                } else {

                    form.requestSubmit();
                }
            });
        });

        /* FORGOT PASSWORD */

        const forgotButton = form.querySelector("#forgotPassword");

        if (forgotButton) {

            forgotButton.addEventListener("click", () => {

                clearMessage();

                if (!validateEmail()) {

                    emailInput.focus();

                    showMessage(
                        "Enter a valid email address first.",
                        true
                    );

                    return;
                }

                showMessage(
                    "Password reset is not connected yet. Backend setup is required.",
                    true
                );
            });
        }

        /* FORM SUBMISSION */

        form.addEventListener("submit", event => {

            event.preventDefault();

            submitted = true;
            clearMessage();

            const results = [];

            if (isRegistration) {
                results.push(validateName());
                results.push(validateUsername());
            }

            results.push(validateEmail());
            results.push(validatePassword());

            if (!results.every(Boolean)) {

                const firstInvalid = form.querySelector(
                    'input[aria-invalid="true"]'
                );

                firstInvalid?.focus();

                return;
            }

            showMessage(
                isRegistration
                    ? "Your details are valid. Account creation is not connected yet."
                    : "Your details are valid. Login is not connected yet."
            );

        });

    });

});
