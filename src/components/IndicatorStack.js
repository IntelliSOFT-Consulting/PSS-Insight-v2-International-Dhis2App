import React, { useState } from 'react';
import {createUseStyles} from 'react-jss';
import {Checkbox} from '@dhis2/ui';
import Table from './Table';
import {
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import EditModal from './EditModal';
import InfoModal from './InfoModal';
import {sortIndicators} from '../utils/helpers';
import {Input} from 'antd';

const useStyles = createUseStyles({
    indicatorStack: {
        display: 'grid',
        gridTemplateColumns: '4rem auto',
        margin: '10px 0',
        border: '1px solid #e0e0e0',
    },
    indicatorCheckbox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorTable: {
        width: '100%',
    },

    tableFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '3rem',
        position: 'relative',
        width: '100%',
    },
    edit: {
        position: 'absolute',
        right: '2rem',
        cursor: 'pointer',
        width: '1rem',
        height: '1rem',
        color: '#0067B9',
    },
    info: {
        position: 'absolute',
        right: '0',
        cursor: 'pointer',
        width: '1.5rem',
        height: '1.5rem',
        color: '#0067B9',
    },
});

export default function IndicatorStack({
                                           indicator,
                                           disabled,
                                           formik,
                                           referenceSheet,
                                           benchmarks,
                                           saveBenchmark,
                                           orgUnit,
                                       }) {
    const classes = useStyles();
    const [editModal, setEditModal] = useState(null);
    const [infoModal, setInfoModal] = useState(null);
    const [newBenchmark, setNewBenchmark] = useState(null);


    const columns = [
        {
            name: indicator.categoryName || '',
            key: 'code',
            width: '7rem',
        },
        {
            name: (
                <div className={classes.tableFlex}>
                    <span>{indicator.indicatorName || ''}</span>
                </div>
            ),
            key: 'name',
            render: row => (
                <div className={classes.tableFlex}>
                    <span>{row.name}</span>
                </div>
            ),
        },
        {
            name: (
                <div className={classes.tableFlex}>
                    <span>International Benchmark</span>
                    <ExclamationCircleIcon
                        className={classes.info}
                        onClick={() => setInfoModal(indicator)}
                    />
                </div>
            ),
            width: '12rem',
            key: 'id',
            render: (_row) => {
                const benchmark = benchmarks.find(benchmark => benchmark.name?.includes(indicator.categoryName));
                return (
                    <div className={classes.tableFlex}>
                        <Input
                            name={indicator.categoryName}
                            defaultValue={
                                benchmark?.value
                            }

                            value={
                                newBenchmark?.name === indicator.categoryName
                                    ? newBenchmark?.value
                                    : benchmark?.value
                            }
                            onChange={(e) => {
                                setNewBenchmark({
                                    name: indicator.categoryName,
                                    id: benchmark?.id,
                                    value: e.target.value,
                                })
                            }}
                            onBlur={
                                async (e) => {
                                    if (newBenchmark && newBenchmark?.value !== benchmark?.value) {
                                        await saveBenchmark({
                                            de: newBenchmark?.id,
                                            value: newBenchmark?.value,
                                        })
                                        setNewBenchmark(null)
                                    }
                                }
                            }
                            placeholder='International Benchmark'
                        />
                    </div>
                )
            },
            rowSpan: indicator.indicatorDataValue?.length?.toString(),
        },
    ];

    return (
        <div className={classes.indicatorStack}>
            <div className={classes.indicatorCheckbox}>
                <Checkbox
                    disabled={disabled}
                    checked={Object.values(formik.values)?.includes(indicator.categoryId)}
                    onChange={({checked}) => {
                        if (checked) {
                            formik.setFieldValue(indicator.categoryId, indicator.categoryId);
                        } else {
                            formik.setFieldValue(indicator.categoryId, '');
                        }
                    }}
                />
            </div>
            <div className={classes.indicatorTable}>
                {
                    <Table
                        columns={columns}
                        tableData={sortIndicators(indicator.indicatorDataValue, 'code')}
                        activeIndicator={true}
                        bordered
                    />
                }
            </div>
            <EditModal
                key={editModal?.categoryId || editModal?.id}
                title='EDIT INSTANCE'
                onCancel={() => setEditModal(null)}
                open={editModal}
                type='info'
                onOk={() => setEditModal(null)}
            />
            <InfoModal
                key={infoModal?.categoryId}
                title={`${infoModal?.code || ''} DEFINITION`}
                onCancel={() => setInfoModal(null)}
                open={infoModal}
                type='info'
                footer={null}
                referenceSheet={referenceSheet}
            />
        </div>
    );
}
