import {
    FaceLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const statusBox = document.getElementById("status-box");

let faceLandmarker;
let webcamRunning = false;

// 1. Inicializar o modelo MediaPipe Face Landmarker
async function createFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
    });
    statusBox.innerText = "Sistema pronto. A solicitar acesso à câmera...";
    startCam();
}

// 2. Ativar a câmara do computador
function startCam() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
        statusBox.innerText = "Monitorização Ativa: Olhos e Rosto Detetados";
    }).catch(err => {
        statusBox.innerText = "Erro: Permissão de câmara negada ou indisponível.";
        console.error(err);
    });
}

let lastVideoTime = -1;
let results = undefined;
const drawingUtils = new DrawingUtils(canvasCtx);

// 3. Processamento frame a frame em tempo real
async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, startTimeMs);
    }

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Desenhar a imagem da webcam no fundo do canvas
    canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
            // Desenha a malha dos pontos faciais (Landmarks) com cor amarela e vermelha
            drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                { color: "#FFC700", lineWidth: 0.5 }
            );
            drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                { color: "#00FF00", lineWidth: 2 }
            );
            drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                { color: "#00FF00", lineWidth: 2 }
            );
            drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LIPS,
                { color: "#FF0000", lineWidth: 2 }
            );
        }
    }

    // Repete o ciclo continuamente a cada frame
    window.requestAnimationFrame(predictWebcam);
}

createFaceLandmarker();