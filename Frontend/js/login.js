const API = "http://127.0.0.1:8000";

async function login(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

try{

const res =
await fetch(
`${API}/login?username=${username}&password=${password}`,
{
method:"POST"
}
);

if(!res.ok)
throw new Error();

const data = await res.json();

localStorage.setItem("username",data.username);
localStorage.setItem("role",data.role);

if(data.role==="admin")
window.location.href="admin.html";

else
window.location.href="user.html";

}
catch{

document.getElementById("error").innerText =
"Invalid login";

}

}
