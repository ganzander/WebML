import { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./Utilities";

function App() {
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  async function runFacemesh() {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    setInterval(() => {
      detect(net);
    }, 100);
  }

  async function detect(net) {
    if (
      typeof webCamRef.current !== "undefined" &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4
    ) {
      const video = webCamRef.current.video;
      const videoWidth = webCamRef.current.video.videoWidth;
      const videoHeight = webCamRef.current.video.videoHeight;
      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const face = await net.estimateFaces(video);

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  }

  runFacemesh();

  return (
    <div>
      <header className="App-header">
        <Webcam
          ref={webCamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
