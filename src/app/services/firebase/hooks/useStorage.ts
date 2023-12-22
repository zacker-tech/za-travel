import { deleteObject, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';

import { selectUser } from '@features/auth/store/authSlice';
import { DocumentToUpload, TripFile } from '@features/trip/types';
import useToast from '@hooks/useToast';
import { useAppSelector } from '@store/index';

import { storage } from '../firebase';

interface Props {
  onAllUploadSuccess: (uploadedFiles: TripFile[]) => void;
  onOneUploadSuccess?: (index: number, uploadedFile: TripFile) => void;
}

interface State {
  uploadProgresses: (number | undefined)[];
  uploadErrors: string[];
  uploadedFiles: TripFile[];
  totalFiles: number;
  isLoading: boolean;
  uploadedFilesCount: number;
  removingFilePath: null | string;
}

const defaultState: State = {
  isLoading: false,
  uploadProgresses: [],
  uploadErrors: [],
  uploadedFiles: [],
  totalFiles: 0,
  uploadedFilesCount: 0,
  removingFilePath: null,
};

export function useStorage({ onAllUploadSuccess, onOneUploadSuccess }: Props) {
  const user = useAppSelector(selectUser);
  const { showErrorMessage } = useToast();
  const [state, setState] = useState<State>(defaultState);

  useEffect(() => {
    if (state.totalFiles > 0 && state.uploadedFilesCount === state.totalFiles) {
      setState((prev) => ({ ...prev, isLoading: false }));
      onAllUploadSuccess(state.uploadedFiles);
    } else if (
      state.totalFiles > 0 &&
      state.uploadedFilesCount + state.uploadErrors.filter(Boolean).length ===
        state.totalFiles
    ) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.totalFiles,
    state.uploadErrors,
    state.uploadedFiles,
    state.uploadedFilesCount,
  ]);

  const uploadFiles = (path: string, files: (DocumentToUpload | null)[]) => {
    setState(defaultState);

    files.forEach((file, index) => {
      setState((prev) => ({
        ...prev,
        totalFiles: files.length,
        isLoading: true,
      }));

      if (file?.storagePath) {
        setState((prevState) => {
          const newUploadedFiles = [...prevState.uploadedFiles];
          newUploadedFiles[index] = file;

          return {
            ...prevState,
            uploadedFilesCount: ++prevState.uploadedFilesCount,
            uploadedFiles: newUploadedFiles,
          };
        });
        return;
      }

      if (!file?.file) {
        setState((prevState) => {
          const newErrors = [...prevState.uploadErrors];
          newErrors[index] = `We are unable to get the file to upload it!`;
          return {
            ...prevState,
            uploadErrors: newErrors,
          };
        });

        return;
      }

      const storageRef = ref(
        storage,
        `user-data/${user?.uid}/${path}/${file.fileName}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, file.file);

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
            onOneUploadSuccess?.(index, newUploadedFiles[index]);

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

  const removeFile = async (storagePath: string) => {
    const desertRef = ref(storage, storagePath);
    setState((prev) => ({ ...prev, removingFilePath: storagePath }));

    try {
      await deleteObject(desertRef);
      return true;
    } catch (error) {
      showErrorMessage(
        'Failed to remove file. Please try again later or contact support!',
      );
    } finally {
      setState((prev) => ({ ...prev, removingFilePath: null }));
    }

    return false;
  };

  const resetUpload = () => setState(defaultState);

  return {
    ...state,
    uploadFiles,
    removeFile,
    resetUpload,
  };
}
