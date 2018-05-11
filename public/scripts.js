function updateUserPassword (e) {
  e.preventDefault();

  const passwordForm = document.getElementById('change-password-form');
  const currentPassword = document.getElementById('currentPasswordInput').value;
  const newPassword = document.getElementById('newPasswordInput').value;
  const newPasswordAgain = document.getElementById('newPasswordAgainInput').value;
  const errorList = document.getElementById("profile_error_list");
  const messageP = document.getElementById('profile_message')

  errorList.innerHTML = "";
  messageP.innerHTML = "";

  const request = new Request('http://localhost:3000/updatePassword', {
    method: 'POST',
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
      newPasswordAgain: newPasswordAgain,
    }),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'same-origin'
  });

  fetch(request).then((response) => {
    passwordForm.reset();
    if (response.status === 200) {
      response.json().then((body) => {
        messageP.innerHTML = body.message;
      });
    } else if (response.status === 500) {
      response.json().then((body) => {
        body.errors.forEach((error) => {
          const errorLi = document.createElement("LI");
          const errorText = document.createTextNode(error);
          errorLi.appendChild(errorText);
          errorList.appendChild(errorLi);
        });
      });
    }
  });
}
