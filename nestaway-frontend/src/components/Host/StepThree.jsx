import axios from "axios";
import { useEffect, useState } from "react";

const StepThree = ({ photos, setPhotos }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nestaway_default");
    if (photos.images.length < 5) {
      axios
        .post("https://api.cloudinary.com/v1_1/dif0nigdy/upload", formData)
        .then((response) => {
          const imageUrl = response.data.secure_url;
          setPhotos((prevState) => {
            setPreviewImage(imageUrl);
            if (prevState.main) {
              return {
                ...prevState,
                images: [...prevState.images, imageUrl],
              };
            } else {
              return {
                ...prevState,
                main: imageUrl,
                images: [...prevState.images, imageUrl],
              };
            }
          });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setErrorMessage("Error uploading image. Please try again.");
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        });
    } else {
      setErrorMessage("You can upload a maximum of 5 images.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    uploadImage(file);
  };
  const handleFileDrop = (event) => {
    event.preventDefault();
    event.target.files = event.dataTransfer.files;

    handleFileUpload(event);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDeleteImage = (imageUrl) => {
    const updatedImages = photos.images.filter((img) => img !== imageUrl);
    if (imageUrl === photos.main) {
      setPhotos((prevState) => ({
        ...prevState,
        main: updatedImages[0],
        images: updatedImages,
      }));
    } else {
      setPhotos((prevState) => ({ ...prevState, images: updatedImages }));
    }

    if (updatedImages.length < 1) {
      return setPreviewImage(null);
    }
    if (imageUrl === previewImage) {
      setPreviewImage(updatedImages[0]);
    }
  };

  useEffect(() => {
    if (photos.main) {
      setPreviewImage(photos.main);
    }
  }, [photos.main]);

  useEffect(() => {
    if (photos?.images.length < 3) {
      setErrorMessage(
        `Upload atleast ${3 - photos?.images.length} more images.`
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }, [photos?.images.length]);

  return (
    <div className="p-4 bg-accent1 flex w-full h-[55vh] justify-around items-center">
      <div className="h-full">
        <div
          className="h-full border cursor-pointer rounded-md shadow-shadow3 focus:outline-none focus:border-primary focus:ring-primary relative overflow-hidden"
          id="fileDropArea"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <p className="h-full flex justify-center items-center text-center bg-gradient-to-b from-tertiary to-primary py-8 px-4 text-accent1">
            Drag and drop your image here, or click to browse
          </p>
          <input
            id="fileInput"
            name="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
        </div>
        {errorMessage && <div className="text-error">{errorMessage}</div>}
      </div>
      <div className="flex flex-col justify-center items-center">
        {previewImage && (
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="h-96 mb-4 rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="flex gap-1 overflow-x-scroll w-[36rem]">
          {photos.images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt={`Uploaded Image ${index + 1}`}
                className={`w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer border-2 hover:border-primary ${
                  previewImage === imageUrl && "border-primary"
                }`}
                onClick={() => setPreviewImage(imageUrl)}
              />
              {photos.main === imageUrl ? (
                <i
                  className="pi pi-star-fill text-primary flex justify-center items-center absolute top-2 left-2"
                  style={{ fontSize: "1rem" }}
                />
              ) : (
                <button
                  className="flex justify-center items-center absolute top-2 left-2 bg-transparent hover:bg-accent1 p-1 transition duration-300"
                  onClick={() =>
                    setPhotos((prevState) => ({ ...prevState, main: imageUrl }))
                  }
                >
                  <i
                    className="pi pi-star text-primary"
                    style={{ fontSize: "1rem" }}
                  ></i>
                </button>
              )}

              <button
                className="flex justify-center items-center absolute top-2 right-2 bg-transparent hover:bg-accent1 p-1 transition duration-300"
                onClick={() => handleDeleteImage(imageUrl)}
              >
                <i
                  className="pi pi-trash text-error"
                  style={{ fontSize: "1rem" }}
                ></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepThree;
