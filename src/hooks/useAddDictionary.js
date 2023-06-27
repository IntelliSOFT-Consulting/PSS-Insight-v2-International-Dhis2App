import { useState } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
import { add, format, set } from 'date-fns';
import { th } from 'date-fns/locale';

/* 
Mutation for adding a dictionary
Dictionary data comes from newIndicator.js form

The form data looks like this:
{
    "indicatorName": "Testing Indicator",
    "systemComponent": "Pharmaceutical Products and Services",
    "indicatorCode": "fghjk,",
    "dimension": "Procurement",
    "definition": "dfghj",
    "dataType": "TEXT",
    "expectedFrequencyDataDissemination": "dfghj",
    "indicatorReference": "fghj",
    "methodOfEstimation": "Qualitative",
    "assessmentQuestions": [
        {
            "name": "Testing select question",
            "valueType": "TEXT",
            "optionSet": {
                 "id": "lc3kfHDOe7t",
                   "options": [
                         {"name": "option", "code": "option"}
                         ]
                }
        }
    ],
    "createdBy": {
        "id": "M5zQapPyTZI",
        "code": "",
        "name": "admin admin",
        "username": "admin",
        "displayName": "admin admin"
    },
    "formula": {
        "format": "Number"
    }
}

This hook needs to be called in newIndicator.js and do the following actions in order:
1. Add the data as it is to DHIS2 datastore
2. For each assessment question, format each question as a data element and add it to DHIS2 (Note: the data element name should be the question name, and if the question has an option set, the data element should have the option set as well. The code for data element should be in this order: indicatorCode + _a, indicatorCode + _b, indicatorCode + _c, etc.)
3. For each created data element, create extra  two data elements with name dataElementCode + _Comment  dataElementCode + _Uploads and  add them to DHIS2
4. Add the created data elements to PSS Program
5. Create a new Data Element Group - If dealing with a new indicator. Use existing one if indicator already exists (Note: the data element group name should be the indicator code, and the data elements should be added to the data element group)
6. Add the new data elements to their respective Data Element Group.
7. Create program indicator (For each applicable data element)
8. Create Indicator (For each applicable data element)

*/

const ADD_DICTIONARY_MUTATION = {
  resource: 'dataStore/Indicator_description/V1',
  type: 'update',
  data: ({ data }) => data,
};

const ADD_DATA_ELEMENT_MUTATION = {
  resource: 'metadata',
  type: 'create',
  data: ({ data }) => data,
};

const ADD_DATA_ELEMENT_GROUP_MUTATION = {
  resource: 'dataElementGroups',
  type: 'create',
  data: ({ data }) => data,
};

const ADD_PROGRAM_INDICATOR_MUTATION = {
  resource: 'programIndicators',
  type: 'create',
  data: ({ data }) => data,
};

export default function useAddDictionary() {
  const [elementNames, setElementNames] = useState([]);
  const [elements, setElements] = useState([]);

  const [mutate, { loading, error, data }] = useDataMutation(
    ADD_DICTIONARY_MUTATION
  );
  const [
    mutateDataElement,
    {
      loading: loadingDataElement,
      error: errorDataElement,
      data: dataDataElement,
    },
  ] = useDataMutation(ADD_DATA_ELEMENT_MUTATION, {
    onComplete: ({ data }) => {
      const { loading: loadingDataElements, datas } = useDataQuery({
        dataElements: {
          resource: 'dataElements',
          params: {
            filter: `name:in:[${elementNames.join(',')}]`,
            fields: 'id,name,code',
          },
        },
      });
      if (datas.dataElements) {
        setElements(datas);
      }
    },
  });
  const [
    mutateDataElementGroup,
    {
      loading: loadingDataElementGroup,
      error: errorDataElementGroup,
      data: dataDataElementGroup,
    },
  ] = useDataMutation(ADD_DATA_ELEMENT_GROUP_MUTATION);

  const [
    mutateProgramIndicator,
    {
      loading: loadingProgramIndicator,
      error: errorProgramIndicator,
      data: dataProgramIndicator,
    },
  ] = useDataMutation(ADD_PROGRAM_INDICATOR_MUTATION);

  //   get indicator descriptions from the datastore: dataStore/Indicator_description/V1
  const { loading: loadingIndicatorDescriptions, data: indicatorDescriptions } =
    useDataQuery({
      dataStore: {
        resource: 'dataStore/Indicator_description',
        id: 'V1',
      },
    });

  // get programStages
  const { loading: loadingProgramStages, data: stages } = useDataQuery({
    programStages: {
      resource: 'programs',
      params: {
        filter: `name:ne:default`,
        fields: 'id,programStages[*]',
      },
    },
  });

  // get indicator types
  const { loading: loadingIndicatorTypes, data: indicatorTypes } = useDataQuery(
    {
      indicatorTypes: {
        resource: 'indicatorTypes',
        params: {
          fields: 'id,displayName',
        },
      },
    }
  );

  const addDataToStore = async dictionary => {
    const storeData = Array.isArray(indicatorDescriptions)
      ? indicatorDescriptions
      : [];
    storeData.push(dictionary);
    await mutate({
      data: storeData,
    });
  };

  // format assessment questions as data elements
  const formatAssessmentQuestions = datas => {
    const dataElements = [];
    datas.assessmentQuestions.forEach((data, index) => {
      const dataElement = {
        name: data.name,
        shortName: data.name,
        code: `${datas.indicatorCode}${String.fromCharCode(97 + index)}`,
        domainType: 'TRACKER',
        valueType: data.valueType?.replace('CODED', 'TEXT'),
        aggregationType:
          data.valueType === ('TEXT' || 'CODED') ? 'COUNT' : 'SUM',
      };
      if (data.optionSet) {
        dataElement.optionSet = {
          id: data.optionSet.id,
        };
      }
      dataElements.push(dataElement);
    });

    // create one more data element for the indicator code
    const dataElement = {
      name: datas.indicatorName,
      shortName: datas.indicatorName.substring(0, 50),
      code: datas.indicatorCode,
      domainType: 'TRACKER',
      valueType: datas.dataType?.replace('CODED', 'TEXT'),
      aggregationType: datas.dataType === ('TEXT' || 'CODED') ? 'COUNT' : 'SUM',
    };
    dataElements.push(dataElement);

    return dataElements;
  };

  // format data elements for comments and uploads
  const formatDataElementsForCommentsAndUploads = dataElements => {
    const dataElementsForCommentsAndUploads = [];
    dataElements.forEach(dataElement => {
      const commentDataElement = {
        name: `${dataElement.code}_Comment`,
        shortName: `${dataElement.code}_Comment`,
        code: `${dataElement.code}_Comment`,
        domainType: 'TRACKER',
        valueType: 'TEXT',
        aggregationType: 'NONE',
      };
      const uploadDataElement = {
        name: `${dataElement.code}_Upload`,
        shortName: `${dataElement.code}_Upload`,
        code: `${dataElement.code}_Upload`,
        domainType: 'TRACKER',
        valueType: 'TEXT',
        aggregationType: 'NONE',
      };
      dataElementsForCommentsAndUploads.push(commentDataElement);
      dataElementsForCommentsAndUploads.push(uploadDataElement);
    });
    return dataElementsForCommentsAndUploads;
  };

  const formatAllDataElements = dictionary => {
    const dataElements = formatAssessmentQuestions(dictionary);
    const dataElementsForCommentsAndUploads =
      formatDataElementsForCommentsAndUploads(dataElements);
    return [...dataElements, ...dataElementsForCommentsAndUploads];
  };

  const createIndicatorDataElements = async (dictionary, dataElements) => {
    try {
      const newElements = elements.dataElements?.dataElements?.map(item => ({
        id: item.id,
      }));
      // add dictionary to data store
      await addDataToStore(dictionary);

      // add data elements to program
      const programStage =
        stages.programStages?.programs?.[0]?.programStages?.[0];
      const stageElements = [
        ...programStage.programStageDataElements,
        ...newElements,
      ];
      programStage.programStageDataElements = stageElements;
      const { response: programResponse } = await mutateDataElement({
        data: { programStages: [programStage] },
      });

      // create data element group
      const dataElementGroup = {
        name: dictionary.indicatorCode,
        shortName: dictionary.indicatorCode,
        code: dictionary.indicatorCode,
        dataElements: newElements,
      };
      const { response: dataElementGroupResponse } =
        await mutateDataElementGroup({
          data: dataElementGroup,
        });

      // create program indicator
      const programIndicator = {
        name: dictionary.indicatorName,
        shortName: dictionary.indicatorCode,
        code: dictionary.indicatorCode,
        program: stages.programStages?.programs?.[0]?.id,
        expression: 'V{event_count}',
        displayInForm: true,
        filter: `#{${programStage.id}.${newElements[0].id}} == 1`,
        analyticsType: 'EVENT',
        aggregationType: 'COUNT',
        analyticsPeriodBoundaries: [
          {
            boundaryTarget: 'EVENT_DATE',
            analyticsPeriodBoundaryType: 'AFTER_START_OF_REPORTING_PERIOD',
          },
          {
            boundaryTarget: 'EVENT_DATE',
            analyticsPeriodBoundaryType: 'BEFORE_END_OF_REPORTING_PERIOD',
          },
        ],
      };
      const { response: programIndicatorResponse } =
        await mutateProgramIndicator({
          data: programIndicator,
        });

      // create indicator
      const indicator = {
        name: dictionary.indicatorCode,
        shortName: dictionary.indicatorCode,
        code: dictionary.indicatorCode,
        indicatorType: indicatorTypes.indicatorTypes?.indicatorTypes?.find(
          item => item.displayName === dictionary.formula.format || 'Number'
        ),
      };
      const { response: indicatorResponse } = await mutateProgramIndicator({
        data: indicator,
      });
      return indicatorResponse;
    } catch (error) {
      throw new Error(error);
    }
  };
  const createIndicator = async dictionary => {
    try {
      const dataElements = formatAllDataElements(dictionary);

      setElementNames(dataElements.map(element => element.name));

      const { response: dataElementResponse } = await mutateDataElement({
        data: { dataElements },
      });

      const indicatorResponse = await createIndicatorDataElements(
        dictionary,
        dataElements,
        dataElementResponse
      );
      return indicatorResponse;
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    formatAllDataElements,
    indicatorDescriptions,
    createIndicator,
    loading:
      loading ||
      loadingDataElement ||
      loadingDataElementGroup ||
      loadingProgramIndicator ||
      loadingIndicatorDescriptions ||
      loadingProgramStages ||
      loadingIndicatorTypes,
    error:
      error ||
      errorDataElement ||
      errorDataElementGroup ||
      errorProgramIndicator,
  };
}
