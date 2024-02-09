const signUpSubmitForm = document.getElementById("signUpForm");

const signUpHandler = async (e) => {
  e.preventDefault();
  try {
    const name = document.getElementById("signUpName").value;
    const password = document.getElementById("signUpPassword").value;
    const email = document.getElementById("signUpEmail").value;

    const response = await axios.post(`http://3.94.254.88:3000/user/signup`, {    
      name,
      password,
      email,
    });
    document.getElementById("signUpName").value = "";
    document.getElementById("signUpPassword").value = "";
    document.getElementById("signUpEmail").value = "";
    window.alert("User Added Successfully");
    window.location.href = "/user/login";
  } catch (e) {   
    if (e.response.status === 403) {
      const ele = document.getElementById("ErrorMessage");
      ele.className += "block";
    }
    {
    }
  }
};

signUpSubmitForm.addEventListener("submit", signUpHandler);
