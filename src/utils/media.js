export const getImageUrl = (image) => {
    console.log(image, "https://api.allerpal.com"+image[0]?.url);
    return "https://api.allerpal.com"+image[0]?.url;
  };
  