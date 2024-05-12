export const splitImagesIntoGroups = (
  imagesArray: String[] | File[] | Blob[],
  groupSize: number
) => {
  const resultArray = [];
  const numGroups = imagesArray?.length / groupSize;

  for (let i = 0; i < numGroups; i++) {
    const startIndex = i * groupSize;
    const group = imagesArray?.slice(startIndex, startIndex + groupSize);
    resultArray.push(group);
  }

  return resultArray;
};
