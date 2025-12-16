import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import learningPathService from '../../../services/learningPathService';
import { LearningPath, mapLearningPathResponsesToLearningPaths } from '../../../types/learningPath';
import ButtonCancel from '../../ButtonCancel/ButtonCancel';
import ButtonSave from '../../ButtonSave/ButtonSave';
import AppModal from '../AppModal/AppModal';
import './ImportModalContent.css';

interface ImportModalContentProps {
  isOpen: boolean,
  omImportPath: (LearningPaths: LearningPath[]) => {};
  onClose: () => void;
}

const ImportModalContent: React.FC<ImportModalContentProps> = ({
  isOpen = false,
  omImportPath,
  onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/json': ['.json'] },
    onDrop: (files) => {
      if (files[0]) setSelectedFile(files[0]);
    },
  });

  const handleImportPath = async () => {
    try {
      if (!selectedFile) return;

      const res = await learningPathService.importLearningPaths({ file: selectedFile });
      if (res.success && res.data) {
        omImportPath(mapLearningPathResponsesToLearningPaths(res.data));
        toast.success("Import lộ trình thành công!");
        onClose();
      }
    }
    catch {
      toast.error("Có lỗi khi import lộ trình!");
    }
  }

  return (
    <AppModal isOpen={isOpen} title='Import lộ trình' onClose={onClose}>
      <div className={`dropzone-wrapper`}>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <i className={`fa-solid fa-file-arrow-up icon ${isDragActive ? 'bounce' : ''}`}></i>
            {selectedFile ? (
              <p><strong>{selectedFile.name}</strong> đã được chọn</p>
            ) : isDragActive ? (
              <p>Thả file <strong>JSON</strong> vào đây...</p>
            ) : (
              <>
                <p>Kéo & thả file JSON vào đây</p>
                <span>hoặc nhấn để chọn file</span>
              </>
            )}
          </div>
        </div>

        <div className="dropzone-actions">
          <ButtonCancel onClick={onClose} />

          <ButtonSave
            onClick={handleImportPath}
            disabled={!selectedFile}
            text='Import'
            icon='fa-solid fa-file-import'
          />
        </div>
      </div>
    </AppModal>
  );
};

export default ImportModalContent;
