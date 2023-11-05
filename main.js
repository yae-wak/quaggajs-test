const start = () => {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.getElementById("quagga"),
        constraints: { facingMode: "environment" },
      },
      decoder: {
        readers: ["code_39_reader", "ean_reader"],
      },
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Initialization finished!!");
      Quagga.start();
    }
  );

  Quagga.onProcessed(onProcessed);
  Quagga.onDetected(onDetected);
};
const onProcessed = (result) => {
  const drawingCtx = Quagga.canvas.ctx.overlay;
  const drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(
        0,
        0,
        parseInt(drawingCanvas.getAttribute("width")),
        parseInt(drawingCanvas.getAttribute("height"))
      );
      result.boxes
        .filter(function (box) {
          return box !== result.box;
        })
        .forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
            color: "green",
            lineWidth: 2,
          });
        });
    }
    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
        color: "#00F",
        lineWidth: 2,
      });
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, {
        color: "red",
        lineWidth: 3,
      });
    }
  }
};

const onDetected = (result) => {
  console.log("detected: ", result);
  document.getElementById("code").innerHTML = result.codeResult.code ?? "";
  stop();
};

const stop = () => {
  Quagga.offProcessed(onProcessed);
  Quagga.offDetected(onDetected);
  Quagga.stop();
};

document.getElementById("startButton")?.addEventListener("click", start);
document.getElementById("stopButton")?.addEventListener("click", stop);
