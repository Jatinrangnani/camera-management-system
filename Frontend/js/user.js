const API = "http://127.0.0.1:8000";


// store multiple live streams
let liveStreams = {};



/* ========================
   LOGOUT
======================== */

function logout()
{
    localStorage.clear();
    window.location = "login.html";
}



/* ========================
   LOAD CAMERA GRID (MULTI LIVE)
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
                    style="width:100%; height:200px; background:black;"
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
   START LIVE PREVIEW
======================== */

async function startLivePreview(cameraId)
{
    try
    {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        const video = document.getElementById(`live_cam_${cameraId}`);

        if(video)
        {
            video.srcObject = stream;
            liveStreams[cameraId] = stream;
        }

        console.log("Live started for camera:", cameraId);
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
        {
            track.stop();
        });

        const video = document.getElementById(`live_cam_${cameraId}`);

        if(video)
            video.srcObject = null;

        delete liveStreams[cameraId];

        console.log("Live stopped for camera:", cameraId);
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

        let html = "";

        cameras.forEach(c =>
        {
            html += `
            <tr>

                <td>${c.id}</td>

                <td>${c.name}</td>

                <td>

                    <button class="btn btn-success btn-sm"
                    onclick="startRecording(${c.id})">
                    Start Recording
                    </button>

                    <button class="btn btn-warning btn-sm"
                    onclick="stopRecording()">
                    Stop Recording
                    </button>

                </td>

            </tr>
            `;
        });

        const table = document.getElementById("cameraTable");

        if(table)
            table.innerHTML = html;

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

        let html = "";

        recordings.forEach(r =>
        {
            html += `
            <tr>

                <td>${r.id}</td>

                <td>${r.camera_id}</td>

                <td>
                    <button class="btn btn-primary btn-sm"
                    onclick="playVideo('${r.file_path}')">
                    Play
                    </button>
                </td>

            </tr>
            `;
        });

        const table = document.getElementById("recordingTable");

        if(table)
            table.innerHTML = html;

    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   START RECORDING
======================== */

async function startRecording(id)
{
    try
    {
        const res = await fetch(
            `${API}/start_recording?camera_id=${id}`,
            { method: "POST" }
        );

        const data = await res.json();

        alert(data.message);

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
        const res = await fetch(
            `${API}/stop_recording`,
            { method: "POST" }
        );

        const data = await res.json();

        alert(data.message);

        loadRecordings();
    }
    catch(err)
    {
        console.error(err);
    }
}



/* ========================
   PLAY VIDEO
======================== */

function playVideo(file)
{
    if(!file)
    {
        alert("Invalid file");
        return;
    }

    file = file.replace("recordings/", "");

    const videoUrl = `${API}/recordings/${file}`;

    const player = document.getElementById("player");

    if(player)
    {
        player.src = videoUrl;
        player.load();
    }
}



/* ========================
   INITIAL LOAD
======================== */

window.onload = function()
{
    loadCameraGrid();
    loadCameras();
    loadRecordings();
};
