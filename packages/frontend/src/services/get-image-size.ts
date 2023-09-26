export const getImageSize = async (image: Blob): Promise<{ width: number; height: number }> => {
  const url = URL.createObjectURL(image);
  const img = new Image();
  img.src = url;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  URL.revokeObjectURL(url);
  return {
    width: img.width,
    height: img.height,
  };
};
