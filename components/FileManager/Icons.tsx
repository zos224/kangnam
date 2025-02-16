import { FiFolder, FiFile, FiImage, FiFileText, FiMusic, FiVideo } from 'react-icons/fi';

interface IconProps {
  className?: string;
}

export const FolderIcon = ({ className }: IconProps) => <FiFolder className={className} />;

export const FileIcon = ({ className, extension }: IconProps & { extension?: string }) => {
  switch (extension?.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FiImage className={className} />;
    case 'txt':
    case 'doc':
    case 'docx':
    case 'pdf':
      return <FiFileText className={className} />;
    case 'mp3':
    case 'wav':
      return <FiMusic className={className} />;
    case 'mp4':
    case 'avi':
      return <FiVideo className={className} />;
    default:
      return <FiFile className={className} />;
  }
}; 