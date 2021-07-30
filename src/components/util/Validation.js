// currently checking for blank fields and password match
function validateForm(event, state) {
    // clear all error messages
    const inputs = document.getElementsByClassName("is-danger");
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].classList.contains("error")) {
        inputs[i].classList.remove("is-danger");
      }
    }
    // validate email is provided if in state (Register/Login)
    if (state.hasOwnProperty("email") && state.email === "") {
      document.getElementById("email").classList.add("is-danger");
      return { blankfield: true };
    }
    // validate password is provided if in state (Register/Login)
    if (state.hasOwnProperty("password") && state.password === "") {
      document.getElementById("password").classList.add("is-danger");
      return { blankfield: true };
    }
    // validate confirmpassword is provided if in state (Register)
    if (state.hasOwnProperty("confirmpassword") && state.confirmpassword === "") {
      document.getElementById("confirmpassword").classList.add("is-danger");
      return { blankfield: true };
    }
    // validate confirmpassword matches password if BOTH are in state (Register)
    if (
      state.hasOwnProperty("password") &&
      state.hasOwnProperty("confirmpassword") &&
      state.password !== state.confirmpassword
    ) {
      document.getElementById("password").classList.add("is-danger");
      document.getElementById("confirmpassword").classList.add("is-danger");
      return { matchedpassword: true, blankfield: false };
    }
    return;
  }

  export default validateForm;