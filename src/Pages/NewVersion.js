import React, { useEffect, useState, useRef } from 'react';
import Card from '../components/Card';
import { Field, Input, TextArea } from '@dhis2/ui';
import { Button } from 'antd';
import {
  createVersion,
  getMasterIndicators,
  getVersionDetails,
  updateVersion,
} from '../api/api';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import classes from '../App.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Title from '../components/Title';
import IndicatorStack from '../components/IndicatorStack';
import Accordion from '../components/Accordion';
import Loading from '../components/Loader';
import { createUseStyles } from 'react-jss';
import { useParams, useNavigate } from 'react-router-dom';
import { mergeCategories, sortIndicatorsByCode } from '../utils/helpers';
import Modal from '../components/Modal';
import { useDataEngine } from '@dhis2/app-runtime';

const useStyles = createUseStyles({
  alertBar: {
    position: 'fixed !important',
    top: '3.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  hidden: {
    display: 'none',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& button': {
      marginRight: '1rem',
    },
  },
});

const validationSchema = Yup.object({
  versionDescription: Yup.string().required('Description is required'),
});

export default function NewVersion({ user }) {
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [indicators, setIndicators] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [referenceSheet, setReferenceSheet] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const engine = useDataEngine();

  const isView = window.location.href.includes('view');

    const queryBenchmarks = async () => {
      // get dataSets
      const { data } = await engine.query({
        data: {
          resource: 'dataSets',
          params: {
            fields: 'id,name',
            paging: false,
            filter: 'name:ilike:Benchmark',
          },
        },
      });

      const { data: dataElements } = await engine.query({
        data: {
          resource: 'dataElements',
          params: {
            fields: 'id,name,displayName',
            paging: false,
            filter: 'name:ilike:Benchmark',
          },
        },
      });

      if (
        data?.dataSets?.length > 0 &&
        dataElements?.dataElements?.length > 0
      ) {
        const dataSetId = data?.dataSets[0]?.id;
        const { data: dataValues } = await engine.query({
          data: {
            resource: 'dataValueSets',
            params: {
              orgUnit: user?.me?.organisationUnits[0]?.id,
              period: new Date().getFullYear() - 1,
              dataSet: dataSetId,
              paging: false,
              fields: 'dataElement,value,displayName',
            },
          },
        });
        const benchmarkData = dataElements?.dataElements?.map(element => {
          const dataValue = dataValues?.dataValues?.find(
            value => value.dataElement === element.id
          );
          return {
            id: element.id,
            name: element.displayName
              ?.replace('Benchmark', '')
              ?.replace('_', ''),
            value: dataValue?.value || 0,
          };
        });
        setBenchmarks(benchmarkData);
        return benchmarkData;
      }
      return [];
    };

  const styles = useStyles();
  const formik = useFormik({
    initialValues: {
      versionDescription: '',
      isPublished: false,
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const indicatorValues = Object.keys(values).filter(
          value =>
            value &&
            value !== 'versionName' &&
            value !== 'versionDescription' &&
            value !== 'isPublished'
        );

        const getSelectedIndicators = indicatorValues.filter(
          item => values[item]
        );

        let response;
        if (id) {
          const data = {
            versionDescription: values.versionDescription,
            isPublished: values.isPublished,
            publishedBy: values.isPublished ? user?.me?.username : null,
            indicators: getSelectedIndicators,
          };

          response = await updateVersion(id, data);
        } else {
          const data = {
            createdBy: user?.me?.username,
            versionName: values.versionName,
            versionDescription: values.versionDescription,
            isPublished: values.isPublished,
            publishedBy: values.isPublished ? user?.me?.username : null,
            indicators: getSelectedIndicators,
          };

          response = await createVersion(data);
        }
        if (response) {
          setSuccess('Template saved successfully');
          setError(false);
          window.scrollTo(0, 0);
          setTimeout(() => {
            navigate('/templates/versions');
          }, 1000);
        }
      } catch (error) {
        setError('Oops! Something went wrong');
        setSuccess(false);
      }
    },
  });

  const getIndicatorDetails = async () => {
    try {
      setLoadingIndicators(true);
      const response = await getVersionDetails(id);
      const data = response[0];

      if (data) {
        setReferenceSheet(data?.referenceSheet);
        formik.setFieldValue('versionName', data?.versionName);
        formik.setFieldValue('versionDescription', data?.versionDescription);
        formik.setFieldValue('isPublished', data?.status === 'PUBLISHED');

        const indicatorValues = data?.indicators?.map(indicator =>
          indicator?.indicators?.map(indicator => indicator.categoryId)
        );

        const flattenedIndicators = indicatorValues?.flat();
        flattenedIndicators.forEach(indicator => {
          formik.setFieldValue(indicator, indicator);
        });
        setLoadingIndicators(false);
      }
    } catch (error) {
      setError('Oops! Something went wrong');
      setLoadingIndicators(false);
    }
  };

  const getIndicators = async () => {
    try {
      setLoadingIndicators(true);
      await queryBenchmarks();
      const res = await getMasterIndicators();

      const data = mergeCategories(res);

      setIndicators(data);
      setLoadingIndicators(false);
    } catch (error) {
      setError('Error loading indicators');
      setLoadingIndicators(false);
    }
  };

  useEffect(() => {
    getIndicators();
    if (id) {
      getIndicatorDetails();
    }
    if (!id) formik.resetForm();
  }, [id]);

  useEffect(() => {
    if (success) {
      formik.resetForm();
      const successTimeout = setTimeout(() => {
        setSuccess(false);
      }, 3000);

      return () => clearTimeout(successTimeout);
    }
  }, [success]);

  useEffect(() => {
    if (formik.errors.versionDescription && formik.touched.versionDescription) {
      const descriptionRef = document.getElementById('versionDescription');
      descriptionRef.scrollIntoView({ behavior: 'smooth' });
      descriptionRef.focus();
    }
  }, [formik.errors.versionDescription, formik.touched.versionDescription]);

  const footer = (
    <div className={styles.cardFooter}>
      <Button
        name='Small button'
        onClick={formik.handleReset}
        small
        value='default'
        className={classes.btnCancel}
      >
        Cancel
      </Button>
      <Button
        name='Small Primary button'
        onClick={() => {
          formik.setFieldValue('isPublished', true);
          formik.handleSubmit();
        }}
        small
        value='default'
        className={classes.btnPublish}
        loading={formik.isSubmitting && formik.values.isPublished}
      >
        Publish template
      </Button>
      <Button
        name='Small button'
        onClick={formik.handleSubmit}
        small
        value='default'
        className={classes.btnSuccess}
        loading={formik.isSubmitting && !formik.values.isPublished}
      >
        Save
      </Button>
    </div>
  );

  return (
    <Card title='CREATE A VERSION' footer={isView ? null : footer}>
      {success && (
        <Modal
          open={success}
          type='success'
          onCancel={() => setSuccess(false)}
          title='Success'
          footer={null}
        >
          <div className={styles.modal}>
            <CheckCircleIcon className={classes.iconSuccess} />
            {success}
          </div>
        </Modal>
      )}

      {error && (
        <Modal
          open={error}
          type='error'
          onCancel={() => setError(false)}
          title='Error'
          footer={null}
        >
          <div className={styles.modal}>
            <XCircleIcon className={classes.iconError} />
            {error}
          </div>
        </Modal>
      )}

      <form className={classes.formGrid}>
        <Field
          label='Version Number'
          validationText={
            formik.errors.versionName && formik.touched.versionName
              ? formik.errors.versionName
              : null
          }
          error={formik.errors.versionName && formik.touched.versionName}
          className={styles.hidden}
        >
          <Input
            name='versionName'
            onChange={({ value }) => formik.setFieldValue('versionName', value)}
            placeholder='Version number'
            disabled
            value={formik.values.versionName}
            error={formik.errors.versionName && formik.touched.versionName}
          />
        </Field>

        <Field
          label='Description'
          required
          error={
            formik.errors.versionDescription &&
            formik.touched.versionDescription
          }
          validationText={
            formik.errors.versionDescription &&
            formik.touched.versionDescription
              ? formik.errors.versionDescription
              : null
          }
        >
          <TextArea
            name='versionDescription'
            id='versionDescription'
            onChange={({ value }) =>
              formik.setFieldValue('versionDescription', value)
            }
            disabled={isView}
            placeholder='Description'
            rows={3}
            required
            value={formik.values.versionDescription}
            error={
              formik.errors.versionDescription &&
              formik.touched.versionDescription
            }
          />
        </Field>
      </form>
      <div className={classes.indicatorsSelect}>
        <Title text='SELECT INDICATORS TO ADD' />
        {loadingIndicators ? (
          <Loading type='skeleton' />
        ) : (
          <div className={classes.indicators}>
            {indicators?.map(indicator => (
              <Accordion
                key={indicator.categoryName}
                title={indicator.categoryName}
              >
                {sortIndicatorsByCode(indicator.indicators).map(indicator => (
                  <IndicatorStack
                    disabled={isView}
                    key={indicator.id}
                    indicator={indicator}
                    onChange={() => {}}
                    formik={formik}
                    isView={isView}
                    referenceSheet={referenceSheet}
                    benchmarks={benchmarks}
                    setBenchmarks={setBenchmarks}
                    orgUnit={user?.me?.organisationUnits[0]?.id}
                  />
                ))}
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
