const UNIQUEID = "KAS963"


async function handleAcceptClick() {
  try {
    const response = await fetch("http://localhost:5000/api/clients/status-update-accept", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uniqueId: UNIQUEID }),
    })
    if (response.ok) {
      const data = await response.json();
      console.log('data', data);
    }
    else {
      console.error('error while updating status');
      const data = await response.json();
      console.log('error data', data);
    }
  } catch (error) {
    console.error('error while updating status', error);
  }
  document.body.removeChild(document.getElementById("cookieModal"));
}

async function handleDenyClick() {
  try {
    const response = await fetch("http://localhost:5000/api/clients/status-update-deny", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uniqueId: UNIQUEID }),
    })
    if (response.ok) {
      const data = await response.json();
      console.log('data', data);
    }
    else {
      console.error('error while updating status');
      const data = await response.json();
      console.log('error data', data);
    }
  } catch (error) {
    console.error('error while updating status', error);
  }
  document.body.removeChild(document.getElementById("cookieModal"));
}

// Function to create and display the cookie modal
function createCookieModal() {
  const modalContainer = document.createElement("div");
  modalContainer.id = "cookieModal";
  modalContainer.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

  const modalContent = document.createElement("div");
  modalContent.style = `
      background: #000;
      color: #fff;
      border-radius: 12px;
      padding: 20px;
      margin: 10px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
      text-align: center;
      font-family: Arial, sans-serif;
    `;

  const heading = document.createElement("h2");
  heading.textContent = "Cookie Policy";
  heading.style = `
      margin-bottom: 16px;
      font-size: 24px;
      font-weight: 600;
    `;

  const message = document.createElement("p");
  message.textContent = "We use cookies to improve your experience. Please accept our cookie policy.";
  message.style = `
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.5;
    `;

  const buttonContainer = document.createElement("div");
  buttonContainer.style = `
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    `;

  const acceptButton = document.createElement("button");
  acceptButton.textContent = "Accept";
  acceptButton.style = `
      background: white;
      color: black;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s;
    `;
  acceptButton.addEventListener("click", handleAcceptClick);

  const denyButton = document.createElement("button");
  denyButton.textContent = "Deny";
  denyButton.style = `
      background: gray;
      color: black;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s;
    `;
  denyButton.addEventListener("click", handleDenyClick);

  buttonContainer.appendChild(denyButton);
  buttonContainer.appendChild(acceptButton);
  modalContent.appendChild(heading);
  modalContent.appendChild(message);
  modalContent.appendChild(buttonContainer);
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);
}

// Show the modal on page load
window.addEventListener("load", createCookieModal);
