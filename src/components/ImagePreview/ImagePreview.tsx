import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface Props {
    link: string;
}

const ImageViewer: React.FC<Props> = ({ link }) => {
    return (
        <PhotoProvider>
            <PhotoView src={link}>
                <img
                    src={link}
                    alt="Preview"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "80vh",
                        cursor: "pointer",
                        display: "block",
                        margin: "0 auto",
                    }}
                />
            </PhotoView>
        </PhotoProvider>
    );
};

export default ImageViewer;