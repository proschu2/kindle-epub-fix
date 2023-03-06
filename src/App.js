import React, { useState } from "react";
import "./App.css";
import { EPUBBook } from "./EPUBBook";
import JSZip from "jszip";
import FileSaver from "file-saver";

function App() {
  const [files, setFiles] = useState([]);
  const [blobs, setBlobs] = useState([]);
  const [dlFilenames, setDlFilenames] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  const downloadFile = () => {
    const file = blobs[0];
    const fileName = dlFilenames[0].replace(/\.[^/.]+$/, ""); // remove file extension
    const reader = new FileReader();
    reader.onload = () => {
      const convertedContent = reader.result; // Here you can add your conversion logic
      const blob = new Blob([convertedContent], {
        type: "application/epub+zip",
      });
      FileSaver.saveAs(blob, `${fileName}.epub`);
    };
    reader.readAsArrayBuffer(file);
    reset();
  };

  const downloadZip = () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, file);
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(content, "files.zip");
    });
    reset();
  };

  const reset = () => {
    setFiles([]);
    setBlobs([]);
    setDlFilenames([]);
  };

  const processEPUB = async (inputBlob, name) => {
    try {
      const epub = new EPUBBook();
      await epub.readEPUB(inputBlob);
      // Run fixing procedure
      epub.fixBodyIdLink();
      epub.fixBookLanguage();
      epub.fixStrayIMG();
      epub.fixEncoding();
      const blob = await epub.writeEPUB();
      files.push(name);
      blobs.push(blob);
      if (epub.fixedProblems.length > 0) {
        dlFilenames.push("[FIX] " + name.replace(" (Z-Library)", ""));
      } else {
        dlFilenames.push("[PACKED] " + name.replace(" (Z-Library)", ""));
      }
    } catch (e) {
      console.error(e);
      files.push(name);
      while (blobs.length !== files.length) {
        blobs.push(null);
      }
      while (dlFilenames.length !== files.length) {
        dlFilenames.push(null);
      }
    }
  };

  const handleFileChange = async (event) => {
    setIsConverting(true);
    for (const file of event.target.files) {
      await processEPUB(file, file.name);
    }
    setIsConverting(false);
  };
  return (
    <div className="App">
      <div className="container">
        <h1> EPUB Fix </h1> <p> Fix UTF - 8 encoding problem </p>
        <p> Fix hyperlink problems </p> <p> Detect invalid tags and images </p>{" "}
        {isConverting ? (
          <button disabled> Converting... </button>
        ) : files.length > 0 && !isConverting ? (
          <div>
            {" "}
            {files.length === 1 ? (
              <button className="download-button" onClick={downloadFile}>
                Download EPUB{" "}
              </button>
            ) : (
              <button className="download-button" onClick={downloadZip}>
                Download Zip{" "}
              </button>
            )}{" "}
          </div>
        ) : (
          <label htmlFor="file-input" className="file-label">
            <span> Choose Files </span>{" "}
            <input
              type="file"
              id="file-input"
              accept=".epub"
              onChange={handleFileChange}
              multiple
            />
          </label>
        )}{" "}
      </div>{" "}
    </div>
  );
}

export default App;
