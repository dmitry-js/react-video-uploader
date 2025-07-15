import { useState, useCallback } from 'react';
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS, UPLOADER_STATUS } from '../utils/constants';
import { convertMbToBytes } from '../utils/uploader';

interface ChunkedUploadOptions {
  onSuccess?: (info: { file: File; uploadId: string }) => void;
  onError?: (error: unknown) => void;
  chunkSizeMb?: number;
}

interface UploadChunkResult {
  ETag: string;
}

// mock API for demonstration. Replace with your backend logic.
const mockUploadStart = async ({ filename }: { filename: string }): Promise<{ uploadId: string }> => {
  return { uploadId: Math.random().toString(36).slice(2) };
};
const mockGetUploadUrl = async ({ uploadId, partNum }: { uploadId: string; partNum: number }): Promise<{ url: string }> => {
  return { url: `/mock-upload/${uploadId}/part/${partNum}` };
};
const mockUploadChunk = async ({ url, chunk, onProgress }: { url: string; chunk: Blob; onProgress?: (percent: number, loaded: number) => void }): Promise<UploadChunkResult> => {
  // simulate upload delay and progress
  return new Promise(resolve => {
    let loaded = 0;
    const total = chunk.size;
    const interval = setInterval(() => {
      loaded += total / 10;
      if (onProgress) onProgress(Math.min(100, (loaded / total) * 100), loaded);
      if (loaded >= total) {
        clearInterval(interval);
        resolve({ ETag: Math.random().toString(36).slice(2) });
      }
    }, 50);
  });
};
const mockFinishUpload = async ({ uploadId, parts }: { uploadId: string; parts: any[] }): Promise<{ success: boolean }> => {
  return { success: true };
};

export function useChunkedUpload({ onSuccess, onError, chunkSizeMb = 100 }: ChunkedUploadOptions) {
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loaded, setLoaded] = useState<number>(0);

  const upload = useCallback(async (file: File) => {
    setStatus(UPLOADER_STATUS.loading);
    setProgress(0);
    setLoaded(0);

    const CHUNK_SIZE = convertMbToBytes(chunkSizeMb);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadId = '';

    try {
      const startRes = await mockUploadStart({ filename: file.name });
      uploadId = startRes.uploadId;
    } catch (e) {
      setStatus(UPLOADER_STATUS.error);
      if (onError) onError(e);
      return;
    }

    const uploadChunksSequentially = async (chunkIndex: number, parts: any[] = [], attempt = 0) => {
      if (chunkIndex >= totalChunks) {
        try {
          await mockFinishUpload({ uploadId, parts });
          setStatus(UPLOADER_STATUS.success);
          if (onSuccess) onSuccess({ file, uploadId });
        } catch (e) {
          setStatus(UPLOADER_STATUS.error);
          if (onError) onError(e);
        }
        return;
      }
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const updateProgress = (percentOfCurrentChunk: number, progressEventLoaded: number) => {
        const percentPerChunk = 100 / totalChunks;
        const currentProgress = chunkIndex * percentPerChunk;
        const bytesUploaded = chunkIndex * CHUNK_SIZE + progressEventLoaded;
        setProgress(Math.round(currentProgress + percentPerChunk * percentOfCurrentChunk / 100));
        setLoaded(bytesUploaded);
      };
      try {
        const { url } = await mockGetUploadUrl({ uploadId, partNum: chunkIndex + 1 });
        const { ETag } = await mockUploadChunk({ url, chunk, onProgress: updateProgress });
        const newParts = [...parts, { PartNumber: chunkIndex + 1, ETag }];
        await uploadChunksSequentially(chunkIndex + 1, newParts);
      } catch (e) {
        if (attempt < MAX_RETRY_ATTEMPTS) {
          setTimeout(() => {
            uploadChunksSequentially(chunkIndex, parts, attempt + 1);
          }, RETRY_DELAY_MS);
        } else {
          setStatus(UPLOADER_STATUS.error);
          if (onError) onError(e);
        }
      }
    };
    uploadChunksSequentially(0);
  }, [chunkSizeMb, onError, onSuccess]);

  return { status, progress, loaded, upload };
} 