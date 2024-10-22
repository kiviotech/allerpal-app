export const getImageUrl = (image) => {
    console.log(image, "http://localhost:1337" + image[0]?.url);
    return "http://localhost:1337" + image[0]?.url;
  };
  