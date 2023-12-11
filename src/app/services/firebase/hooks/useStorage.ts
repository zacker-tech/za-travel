import { ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';

import { selectUser } from '@features/auth/store/authSlice';
import { DocumentToUpload, TripFile } from '@features/trip/types';
import { useAppSelector } from '@store/index';

import { storage } from '../firebase';

interface Props {
  onAllUploadSuccess: (uploadedFiles: TripFile[]) => void;
}

export function useStorage({ onAllUploadSuccess }: Props) {
  const user = useAppSelector(selectUser);

  const [state, setState] = useState<{
    uploadProgresses: (number | undefined)[];
    uploadErrors: string[];
    uploadedFiles: TripFile[];
    totalFiles: number;
    uploadedFilesCount: number;
  }>({
    uploadProgresses: [],
    uploadErrors: [],
    uploadedFiles: [],
    totalFiles: 0,
    uploadedFilesCount: 0,
  });

  useEffect(() => {
    if (state.totalFiles > 0 && state.uploadedFilesCount === state.totalFiles) {
      onAllUploadSuccess(state.uploadedFiles);
    }
  });

  const uploadFiles = (path: string, files: DocumentToUpload[]) => {
    files.forEach((file, index) => {
      if (!file?.file) {
        return;
      }

      const storageRef = ref(
        storage,
        `user-data/${user?.uid}/${path}/${file.fileName}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, file.file);

      setState((prev) => ({ ...prev, totalFiles: files.length }));

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const newProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setState((prevState) => {
            const newProgresses = [...prevState.uploadProgresses];
            newProgresses[index] = newProgress;
            return {
              ...prevState,
              uploadProgresses: newProgresses,
            };
          });
        },
        (error) => {
          setState((prevState) => {
            const newProgresses = [...prevState.uploadProgresses];
            newProgresses[index] = undefined;

            const newErrors = [...prevState.uploadErrors];
            newErrors[index] = `Something went wrong: ${error.message}`;
            return {
              ...prevState,
              uploadProgresses: newProgresses,
              uploadErrors: newErrors,
            };
          });
        },
        () => {
          setState((prevState) => {
            const newProgresses = [...prevState.uploadProgresses];
            newProgresses[index] = undefined;

            const newUploadedFiles = [...prevState.uploadedFiles];
            newUploadedFiles[index] = {
              fileName: file.fileName,
              storagePath: uploadTask.snapshot.ref.fullPath,
            };

            return {
              ...prevState,
              uploadedFiles: newUploadedFiles,
              uploadProgresses: newProgresses,
              uploadedFilesCount: ++prevState.uploadedFilesCount,
            };
          });
        },
      );
    });
  };

  return {
    ...state,
    uploadFiles,
  };
}
