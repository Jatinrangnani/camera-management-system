const API = "http://127.0.0.1:8000";

let recordingActive = false;
let currentCameraId = null;

// store live streams for multiple cameras
let liveStreams = {};



/* ========================
   ADD CAMERA
======================== */

async function addCamera()
{
    const name = document.getElementById("cameraName").value.trim();
    const location = document.getElementById("cameraLocation").value.trim();
    const source = document.getElementById("cameraSource").value.trim();

    if(!name || !location || !source)
    {
        alert("Please fill all fields");
        return;
    }

    try
    {
        const res = await fetch(
            `${API}/add_camera?name=${encodeURIComponent(name)}&location=${encodeURIComponent(location)}&source=${encodeURIComponent(source)}`,
            { method:"POST" }
        );

        const data = await res.json();

        alert(data.message || "Camera added");

        document.getElementById("cameraName").value="";
        document.getElementById("cameraLocation").value="";
        document.getElementById("cameraSource").value="";

        loadCameras();
        loadCameraGrid();
    }
    catch(err)
    {
        console.error(err);
        alert("Failed to add camera");
    }
}



/* ========================
   LOAD CAMERAS TABLE
======================== */

async function loadCameras()
{
    try
    {
        const res = await fetch(`${API}/get_cameras`);
        const cameras = await res.json();

        document.getElementById("totalCameras").innerText = cameras.length;

        let html="";

        cameras.forEach(camera =>
        {
            html+=`
            <tr>

                <td>${camera.id}</td>

                <td>${camera.name}</td>

                <td>

                    <button class="btn btn-success btn-sm"
                    onclick="startRecording(${camera.id})"
                    ${recordingActive ? "disabled" : ""}>
                    Start Recording
                    </button>

                    <button class="btn btn-warning btn-sm"
                    onclick="stopRecording()"
                    ${!recordingActive ? "disabled" : ""}>
                    Stop Recording
                    </button>

                </td>

                <td>

                    <button class="btn btn-danger btn-sm"
                    onclick="deleteCamera(${camera.id})">
                    Delete
                    </button>

                </td>

            </tr>
            `;
        });

        document.getElementById("cameraTable").innerHTML = html;
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   LOAD CAMERA GRID (LIVE PREVIEW)
======================== */

async function loadCameraGrid()
{
    try
    {
        const res = await fetch(`${API}/get_cameras`);
        const cameras = await res.json();

        const grid = document.getElementById("cameraGrid");

        if(!grid) return;

        grid.innerHTML = "";

        cameras.forEach(camera =>
        {
            const col = document.createElement("div");

            col.className = "col-md-4";

            col.innerHTML = `

            <div class="card p-2 mb-3">

                <h6>${camera.name}</h6>

                <video
                    id="live_cam_${camera.id}"
                    autoplay
                    muted
                ></video>

                <button class="btn btn-success btn-sm mt-2"
                onclick="startLivePreview(${camera.id})">

                Start Live

                </button>

                <button class="btn btn-danger btn-sm mt-2"
                onclick="stopLivePreview(${camera.id})">

                Stop

                </button>

            </div>

            `;

            grid.appendChild(col);
        });

    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   START LIVE PREVIEW (MULTI CAMERA)
======================== */

async function startLivePreview(cameraId)
{
    try
    {
        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:false
        });

        const video = document.getElementById(`live_cam_${cameraId}`);

        video.srcObject = stream;

        liveStreams[cameraId] = stream;
    }
    catch(err)
    {
        console.error(err);
        alert("Camera access denied");
    }
}



/* ========================
   STOP LIVE PREVIEW
======================== */

function stopLivePreview(cameraId)
{
    if(liveStreams[cameraId])
    {
        liveStreams[cameraId].getTracks().forEach(track =>
            track.stop()
        );

        document.getElementById(`live_cam_${cameraId}`).srcObject = null;

        delete liveStreams[cameraId];
    }
}



/* ========================
   START RECORDING
======================== */

async function startRecording(cameraId)
{
    try
    {
        const res = await fetch(
            `${API}/start_recording?camera_id=${cameraId}`,
            { method:"POST" }
        );

        const data = await res.json();

        alert(data.message);

        recordingActive = true;
        currentCameraId = cameraId;

        loadCameras();
        loadRecordings();
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   STOP RECORDING
======================== */

async function stopRecording()
{
    try
    {
        const res = await fetch(`${API}/stop_recording`, {
            method:"POST"
        });

        const data = await res.json();

        alert(data.message);

        recordingActive = false;
        currentCameraId = null;

        loadCameras();
        loadRecordings();
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   DELETE CAMERA
======================== */

async function deleteCamera(id)
{
    if(!confirm("Delete camera?")) return;

    try
    {
        const res = await fetch(
            `${API}/delete_camera/${id}`,
            { method:"DELETE" }
        );

        const data = await res.json();

        alert(data.message);

        loadCameras();
        loadCameraGrid();
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   LOAD RECORDINGS
======================== */

async function loadRecordings()
{
    try
    {
        const res = await fetch(`${API}/get_recordings`);
        const recordings = await res.json();

        document.getElementById("totalRecordings").innerText = recordings.length;

        let html="";

        recordings.forEach(rec =>
        {
            html+=`
            <tr>

                <td>${rec.id}</td>

                <td>${rec.camera_id}</td>

                <td>
                    <button class="btn btn-primary btn-sm"
                    onclick="playVideo('${rec.file_path}')">
                    Play
                    </button>
                </td>

                <td>
                    <button class="btn btn-danger btn-sm"
                    onclick="deleteRecording(${rec.id})">
                    Delete
                    </button>
                </td>

            </tr>
            `;
        });

        document.getElementById("recordingTable").innerHTML = html;
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   PLAY VIDEO
======================== */

function playVideo(filename)
{
    document.getElementById("player").src =
        `${API}/recordings/${filename}`;
}



/* ========================
   USERS
======================== */

async function loadUsers()
{
    try
    {
        const res = await fetch(`${API}/get_users`);
        const users = await res.json();

        let html="";

        users.forEach(user =>
        {
            html+=`
            <tr>

                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>

                <td>
                    <button class="btn btn-danger btn-sm"
                    onclick="deleteUser(${user.id})">
                    Delete
                    </button>
                </td>

            </tr>
            `;
        });

        document.getElementById("usersTable").innerHTML = html;
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   LOGOUT
======================== */

function logout()
{
    localStorage.clear();
    window.location="login.html";
}



/* ========================
   INITIAL LOAD
======================== */

window.onload = function()
{
    loadCameras();
    loadRecordings();
    loadUsers();
    loadCameraGrid();
};
