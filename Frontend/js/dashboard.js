const API = "http://127.0.0.1:8000";


// LOAD CAMERAS
async function loadCameras(){

    const res = await fetch(`${API}/get_cameras`);
    const cameras = await res.json();

    let html = "";

    cameras.forEach(camera => {

        html += `
        <tr>

            <td>${camera.id}</td>

            <td>${camera.name}</td>

            <td>${camera.location}</td>

            <td>

                <button onclick="startRecording(${camera.id})">
                    Start
                </button>

                <button onclick="deleteCamera(${camera.id})"
                style="background:red;color:white;">
                    Delete
                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById("cameraTable").innerHTML = html;
}



// LOAD RECORDINGS
async function loadRecordings(){

    const res = await fetch(`${API}/get_recordings`);
    const recordings = await res.json();

    let html = "";

    recordings.forEach(rec => {

        html += `
        <tr>

            <td>${rec.id}</td>

            <td>${rec.camera_id}</td>

            <td>

                <button onclick="playVideo('${rec.file_path}')">
                    Play
                </button>

            </td>

            <td>

                <button onclick="deleteRecording(${rec.id})"
                style="background:red;color:white;">
                    Delete
                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById("recordingsTable").innerHTML = html;
}



// START RECORDING
async function startRecording(camera_id){

    await fetch(`${API}/start_recording?camera_id=${camera_id}`,{

        method:"POST"

    });

    alert("Recording started");

}



// STOP RECORDING
async function stopRecording(){

    await fetch(`${API}/stop_recording`,{

        method:"POST"

    });

    alert("Recording stopped");

    loadRecordings();

}



// PLAY VIDEO
function playVideo(filename){

    document.getElementById("videoPlayer").src =
        `${API}/recordings/${filename}`;

}



// DELETE RECORDING
async function deleteRecording(id){

    if(!confirm("Delete this recording?")) return;

    await fetch(`${API}/delete_recording/${id}`,{

        method:"DELETE"

    });

    alert("Recording deleted");

    loadRecordings();

}



// DELETE CAMERA
async function deleteCamera(id){

    if(!confirm("Delete this camera?")) return;

    await fetch(`${API}/delete_camera/${id}`,{

        method:"DELETE"

    });

    alert("Camera deleted");

    loadCameras();

}



// LOGOUT
function logout(){

    localStorage.clear();

    window.location.href = "login.html";

}

// LOAD USERS
async function loadUsers() {

    const res = await fetch(`${API}/get_users`);
    const users = await res.json();

    let html = "";

    users.forEach(user => {

        html += `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="deleteUser(${user.id})"
                    class="btn btn-danger btn-sm">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("usersTable").innerHTML = html;
}


// CREATE USER
async function createUser() {

    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newRole").value;

    await fetch(`${API}/create_user?username=${username}&password=${password}&role=${role}`, {
        method: "POST"
    });

    alert("User created");

    loadUsers();
}


// DELETE USER
async function deleteUser(id) {

    if (!confirm("Delete this user?")) return;

    await fetch(`${API}/delete_user/${id}`, {
        method: "DELETE"
    });

    alert("User deleted");

    loadUsers();
}



// LOAD EVERYTHING ON PAGE LOAD
loadCameras();
loadUsers();


loadRecordings();
 