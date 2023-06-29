class CreateIndicator {
    async addDataToStore (dictionary, indicatorDescriptions) {
    const storeData = Array.isArray(indicatorDescriptions)
      ? indicatorDescriptions
      : [];
    storeData.push(dictionary);
    return storeData;
  };
}