import React, { memo, useCallback, useState } from 'react';

type AttachImagesProps = {
  label?: string;
  images: string[];
  placeholder?: string;
  onChange: (nextImages: string[]) => void;
};

const MAX_IMAGES = 5;

const AttachImages: React.FC<AttachImagesProps> = ({ images, onChange, label = 'Attach Images', placeholder = 'https://example.com/image.png' }) => {
  const [url, setUrl] = useState('');
  const trimmedUrl = url.trim();
  const isAtLimit = images.length >= MAX_IMAGES;
  const canAdd = trimmedUrl.length > 0 && !isAtLimit;

  const handleAdd = () => {
    if (!canAdd || isAtLimit) return;
    onChange([...images, trimmedUrl]);
    setUrl('');
  };

  const handleRemove = useCallback((index: number) => {
    onChange(images.filter((_, idx) => idx !== index))
  }, [images, onChange]);

  return (
    <div className="flex flex-col gap-3 text-primary-color">
      <div className="flex items-center justify-between">
        <label className="font-medium text-sm">{label}</label>
        <span className="text-xs text-secondary-color">
          {images.length}/{MAX_IMAGES} images
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={isAtLimit ? `Maximum ${MAX_IMAGES} images allowed` : placeholder}
          disabled={isAtLimit}
          className="flex-1 rounded-md border border-border-color bg-primary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled={!canAdd}
          onClick={handleAdd}
          className="rounded-md disabled:bg-secondary-bg! disabled:text-secondary-color! disabled:cursor-not-allowed bg-main-color! px-4 py-2! text-sm font-semibold text-black-color!"
        >
          Add
        </button>
      </div>
      {isAtLimit && (
        <p className="text-xs text-secondary-color">
          Maximum {MAX_IMAGES} images allowed. Remove an image to add a new one.
        </p>
      )}

      <div className="flex flex-col rounded-md overflow-hidden">
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
      className="flex items-center gap-3 border-b border-border-color bg-secondary-bg px-3 py-3 text-sm text-secondary-color"
    >
      <span className="truncate pl-2 text-secondary-color">{index + 1}.</span>
      <span className="truncate pl-2 text-primary-color">{imageUrl}</span>
      <button
        type="button"
        onClick={() => handleRemove(index)}
        className="px-3! py-1! text-xs! font-bold! bg-red-500! text-white! ml-auto"
      >
        Delete
      </button>
    </div>

  )
})

export default AttachImages;