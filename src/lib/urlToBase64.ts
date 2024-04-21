type ImgUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${string}`;

export const imageUrlToBase64 = async (url: ImgUrl) => {
  const data = await fetch(url);
  const blob = await data.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};
