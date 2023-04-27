import React from 'react';
import Modal from './Modal';
import { createUseStyles } from 'react-jss';
import { PaperClipIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const useStyles = createUseStyles({
  infoModal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#CCE0F1',
    width: 'max-content',
    '& svg': {
      marginRight: '0.5rem',
      width: '1rem',
      height: '1rem',
    },
  },
});

export default function InfoModal(props) {
  const classes = useStyles();
  const referenceSheetLink = props.referenceSheet
    ? `http://172.104.91.116:7009/api/v1/master-template/view-file/${props.referenceSheet}`
    : `${window.location.origin}/#/indicators/indicator/${props.open?.categoryId}`;
  return (
    <Modal {...props} type='info'>
      <div classname={classes.infoModal}>
        <div>{props.open?.indicatorName}</div>
        <a
          href={referenceSheetLink}
          className={classes.infoLink}
          target='_blank'
          rel='noreferrer'
        >
          <PaperClipIcon />
          Reference Sheet
        </a>
      </div>
    </Modal>
  );
}
