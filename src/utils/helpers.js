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

export const formatFormula = (formula, dataElements) => {
  const variableRegex = /\{([^}]+)\}/g;

  const replacedFormula = formula?.replace(variableRegex, (match, name) => {
    const index = dataElements?.find(q => q.name?.trim() === name.trim());
    return `#{${index.id.toString()}}`;
  });

  return replacedFormula;
};

export const formatExpression = (formula, dataElements, programStageId) => {
  const variableRegex = /\{([^}]+)\}/g;

  const replacedFormula = formula?.replace(variableRegex, (match, name) => {
    const index = dataElements?.find(q => q.name?.trim() === name.trim());
    return `#{${programStageId}}.#{${index.id.toString()}}`;
  });

  const replacedFormula2 = replacedFormula
    ?.replace(/AND/g, '&&')
    .replace(/OR/g, '||')
    .replace(/NOTEQUAL/g, '!=')
    ?.replace(/\s/g, '');
  return replacedFormula2?.trim();
};

export const filterValidEmails = emails => {
  return emails.filter(email => {
    return email.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/);
  });
};

export const sentenceCase = str => {
  if (!str) return '';
  return str?.charAt(0)?.toUpperCase() + str?.toLowerCase()?.slice(1);
};
