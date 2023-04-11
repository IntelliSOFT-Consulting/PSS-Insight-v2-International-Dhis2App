export const sortIndicators = (indicators, key) => {
  return indicators.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
};

export const sortIndicatorsByCode = indicators => {
  return indicators?.sort((a, b) => {
    if (!a.indicatorDataValue) {
      return 1;
    }
    const aCode = a.indicatorDataValue[0]?.code;
    const bCode = b.indicatorDataValue[0]?.code;
    if (aCode < bCode) {
      return -1;
    }
    if (aCode > bCode) {
      return 1;
    }
    return 0;
  });
};


export const mergeCategories = data => {
  const categories = data.map(category => category.categoryName);
  const uniqueCategories = [...new Set(categories)];
  const formattedData = uniqueCategories.map(category => {
    const indicators = data
      .filter(item => item.categoryName === category)
      .map(item => item.indicators);
    const mergedIndicators = [].concat.apply([], indicators);
    return { categoryName: category, indicators: mergedIndicators };
  });
  return formattedData;
};

export const sortVersions = versions => {
  return versions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};