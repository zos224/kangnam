import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadCrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export default function BreadCrumb({ path, onNavigate }: BreadCrumbProps) {
  const parts = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center p-4 text-sm">
      <button
        className="flex items-center hover:bg-gray-100 rounded p-1"
        onClick={() => onNavigate('')}
      >
        <FiHome className="w-4 h-4 mr-1" />
        Home
      </button>
      
      {parts.map((part, index) => {
        const currentPath = parts.slice(0, index + 1).join('/');
        return (
          <div key={currentPath} className="flex items-center">
            <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <button
              className="hover:bg-gray-100 rounded p-1"
              onClick={() => onNavigate(currentPath)}
            >
              {part}
            </button>
          </div>
        );
      })}
    </div>
  );
} 