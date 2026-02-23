import { useState, type ChangeEvent } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  previewUrl?: string; // for edit mode
}

const ImageUploadPreview: React.FC<Props> = ({
  onFileSelect,
  previewUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center">

      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center">

        {/* ✅ Show NEW selected image */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
        )}

        {/* ✅ Show EXISTING image (edit mode) */}
        {!preview && previewUrl && (
          <img
            src={previewUrl}
            alt="existing"
            className="w-full h-full object-cover"
          />
        )}

        {/* ✅ Show Upload text (add mode) */}
        {!preview && !previewUrl && (
          <span className="text-gray-500">Upload</span>
        )}

      </div>

      <input type="file" accept="image/*" onChange={handleImageChange} />

    </div>
  );
};

export default ImageUploadPreview;