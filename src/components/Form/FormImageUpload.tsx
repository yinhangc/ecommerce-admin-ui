import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

type ImageUploadButtonProps = {
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};
const ImageUploadButton: React.FC<ImageUploadButtonProps> = (props) => {
  const { handleUpload } = props;

  return (
    <>
      <label
        htmlFor="images"
        className="inline-block cursor-pointer rounded border px-4 py-1 text-gray-600 shadow"
      >
        上載相片
      </label>
      <input
        multiple={true}
        id="images"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
      />
    </>
  );
};

type FormImageUpload = {
  onChange: ControllerRenderProps['onChange'];
  value: (string | Blob)[];
};
export const FormImageUpload: React.FC<FormImageUpload> = (props) => {
  const { onChange, value } = props;
  console.log('FormImageUpload value', value);
  // const [uploadedImages, setUploadedImages] = useState<(string | Blob)[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;
    onChange([...value, ...files]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => index !== i));
  };

  useEffect(() => {
    const objectUrls = Array.from(value).map((f: string | Blob) =>
      f instanceof Blob ? URL.createObjectURL(f) : f,
    );
    setPreviewImageUrls(objectUrls);
  }, [onChange, value]);

  return (
    <div className="w-full rounded border p-4 text-center">
      {previewImageUrls.length === 0 && (
        <ImageUploadButton handleUpload={handleUpload} />
      )}
      {previewImageUrls.length > 0 && (
        <>
          <div className="mb-6 grid grid-cols-4 gap-x-2 gap-y-4">
            {previewImageUrls.map((url, i) => (
              <div key={i} className="relative place-self-center">
                <button type="button" onClick={() => handleRemove(i)}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute right-0 top-0 h-5 w-5 rounded-full bg-gray-200 bg-opacity-80 p-2 text-red-600"
                  />
                </button>
                <div className="flex max-h-[10rem] max-w-[10rem]">
                  <img src={url} className="h-auto w-full object-contain" />
                </div>
              </div>
            ))}
          </div>
          <ImageUploadButton handleUpload={handleUpload} />
        </>
      )}
    </div>
  );
};
