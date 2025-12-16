import React, { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

interface Props {
  file: string;
}

const WebViewerPreview: React.FC<Props> = ({ file }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer",
        initialDoc: file,
        isReadOnly: true,
      },
      viewerRef.current!
    ).then((instance) => {
      const { UI } = instance;

      UI.disableElements([
        "toolbarGroup-Annotate",
        "toolbarGroup-Edit",
        "toolbarGroup-Insert",
        "toolbarGroup-Forms",
        "toolbarGroup-Shapes",
        "toolbarGroup-FillAndSign",
        "toolbarGroup-Search",
        "toolbarGroup-Organize",
        "toolbarGroup-Measure",
        "toolbarGroup-Protection",
        "toolbarGroup-Compress",
        "toolbarGroup-Redaction",
        "toolbarGroup-EditText",
        "toolbarGroup-Stamp",
        "toolbarGroup-Signature",
        "toolbarGroup-Print",
        "toolbarGroup-File"
      ]);

      instance.Core.documentViewer.addEventListener("documentLoaded", () => {
        const cropDialog = document.querySelector(".CropDialog");
        if (cropDialog) {
          (cropDialog as HTMLElement).style.display = "none";
        }
      });
    });
  }, [file]);

  return <div ref={viewerRef} style={{ height: "80vh", width: "100%" }} />;
};

export default WebViewerPreview;