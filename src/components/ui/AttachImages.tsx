import React, { memo, useCallback, useState } from 'react';

type AttachImagesProps = {
  label?: string;
  images: string[];
  placeholder?: string;
  onChange: (nextImages: string[]) => void;
};

const AttachImages: React.FC<AttachImagesProps> = ({ images, onChange, label = 'Attach Images', placeholder = 'https://example.com/image.png' }) => {
  const [url, setUrl] = useState('');
  const trimmedUrl = url.trim();
  const canAdd = trimmedUrl.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onChange([...images, trimmedUrl]);
    setUrl('');
  };

  const handleRemove = useCallback((index: number) => {
    onChange(images.filter((_, idx) => idx !== index))
  }, [images, onChange]);

  return (
    <div className="flex flex-col gap-3 text-primary-color">
      <label className="font-medium text-sm">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-border-color bg-primary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
        />
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-main-color px-4 py-2 text-sm font-semibold text-black-color shadow-[0_6px_20px_var(--shadow-color)] transition hover:-translate-y-0.5"
          >
            Add
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {
          images.map((imageUrl, index) => (
            <AttachedImageInstance 
              index={index}
              key={`${imageUrl}-${index}`} 
              imageUrl={imageUrl} 
              handleRemove={handleRemove}
            />
          ))
        }
      </div>
    </div>
  );
};

interface AttachedImageInstanceProps {
  imageUrl: string;
  index: number;
  handleRemove: (index: number) => void;
}

const AttachedImageInstance = memo(({ imageUrl, index, handleRemove }: AttachedImageInstanceProps) => {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md border border-border-color bg-secondary-bg px-3 py-2 text-sm text-secondary-color"
    >
      <span className="truncate pl-2 text-primary-color">{imageUrl}</span>
      <button
        type="button"
        onClick={() => handleRemove(index)}
        className="text-xs font-bold! bg-main-color! text-black-color!"
      >
        Delete
      </button>
    </div>

  )
})

export default AttachImages;