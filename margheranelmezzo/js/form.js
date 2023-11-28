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
    window.location.href = 'https://clairespot.com/margheranelmezzo';
}
