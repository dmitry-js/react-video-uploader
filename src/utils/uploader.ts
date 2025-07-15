import { UPLOADER_SIZE_UNIT } from './constants';

export const bytesInKb = 1024;
export const bytesInMb = 1024 * bytesInKb;
export const bytesInGb = 1024 * bytesInMb;

export const convertMbToBytes = (mb: number): number => mb * bytesInMb;
export const convertGbToBytes = (gb: number): number => gb * bytesInGb;
export const convertBytesToKb = (bytes: number): number => bytes / bytesInKb;
export const convertBytesToMb = (bytes: number): number => bytes / bytesInMb;
export const convertBytesToGb = (bytes: number): number => bytes / bytesInGb;
export const convertFileSize = (bytes: number): string => {
  if (bytes < bytesInMb) {
    return `${(bytes / bytesInKb).toFixed(2)} KB`;
  }
  return `${(bytes / bytesInMb).toFixed(2)} MB`;
};

export const isExtensionValid = ({ accept, file }: { accept: string[]; file: File }): boolean => accept.some(format => file.name?.toLowerCase().endsWith(format));

export const addUppercaseExtensions = (accept: string[]): string[] => {
  return accept.reduce<string[]>((result, ext) => result.concat([ext, ext.toUpperCase()]), []);
};

export const getFileDescription = ({
  accept,
  size: { value, unit = UPLOADER_SIZE_UNIT.mb },
}: {
  accept: string[];
  size: { value: number; unit?: string };
}): { extensions: string; size: string } => {
  const sizeMap = {
    [UPLOADER_SIZE_UNIT.kb]: {
      convert: convertBytesToKb,
      unit: 'KB',
    },
    [UPLOADER_SIZE_UNIT.mb]: {
      convert: convertBytesToMb,
      unit: 'MB',
    },
    [UPLOADER_SIZE_UNIT.gb]: {
      convert: convertBytesToGb,
      unit: 'GB',
    },
  }[unit];

  return {
    extensions: accept.join(', '),
    size: `${Math.round(sizeMap.convert(value))} ${sizeMap.unit}`,
  };
};

export { UPLOADER_SIZE_UNIT }; 