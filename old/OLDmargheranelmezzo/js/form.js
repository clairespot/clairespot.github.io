function onUploadChange(input) {
    enableSubmit();
    displayFileName(input);
}

function displayFileName(input) {
    const fileInput = document.getElementById('attachment');
    const fileNameDisplay = document.getElementById('file-name');
    
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
        fileNameDisplay.textContent = "\u00A0";
    }
}

function enableSubmit() {
    let inputs = document.querySelectorAll("input[required]");
    let submitButton = document.querySelector('input[type="submit"]');
    let isValid = true;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === "" || inputs[i].value === null){
            isValid = false;
            break;
        }
    }
    submitButton.disabled = !isValid;
}

function onSubmitForm() {
    const input = document.getElementById('submit-button');
    input.value = 'invio in corso...';
    input.disabled = true;
}

function goToIndex() {
    window.location.href = window.location.origin + '/margheranelmezzo';
}

function manageLoad() {
    if (window.history.replaceState) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const load = urlParams.get('load');

        if (load === null) {
            window.history.replaceState({}, 'Marghera nel mezzo', window.location.href + '?load=true');
        } else {
            window.location.href = window.location.href.replace('form.html?load=true', '')
        }
    }
}

// Make reCAPTCHA required
window.onload = function() {
    var el = document.getElementById('g-recaptcha-response');
    if (el) {
        el.setAttribute('required', 'required'); 
    }
    manageLoad();
}
