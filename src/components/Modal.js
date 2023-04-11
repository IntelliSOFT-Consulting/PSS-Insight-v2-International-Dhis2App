import React, { useLayoutEffect } from 'react';
import { Modal } from 'antd';

export default function ModalItem({ children, type, ...props }) {
  const updateClassName = () => {
    const modal = document.querySelector('.ant-modal-content');
    if (modal) {
      switch (type) {
        case 'info':
          document
            .querySelector('.ant-modal-close-icon')
            ?.classList.add('icon-info');
          document
            .querySelector('.ant-modal-header')
            ?.classList.add('modal-info');
          break;
        case 'warning':
          document
            .querySelector('.ant-modal-close-icon')
            ?.classList.add('icon-warning');
          document
            .querySelector('.ant-modal-header')
            ?.classList.add('modal-warning');
          break;
        case 'error':
          document
            .querySelector('.ant-modal-close-icon')
            ?.classList.add('icon-danger');
          document
            .querySelector('.ant-modal-header')
            ?.classList.add('modal-danger');
          break;
        case 'success':
          document
            .querySelector('.ant-modal-close-icon')
            ?.classList.add('icon-success');
          document
            .querySelector('.ant-modal-header')
            ?.classList.add('modal-success');
          break;
        default:
          document
            .querySelector('.ant-modal-close-icon')
            ?.classList.add('icon-info');
          document
            .querySelector('.ant-modal-header')
            ?.classList.add('modal-info');
          break;
      }
    }
  };

  useLayoutEffect(() => {
    if (props.open) {
      updateClassName();
    }
    return () => {
      document
        .querySelector('.ant-modal-close-icon')
        ?.classList.remove('icon-info');
      document
        .querySelector('.ant-modal-close-icon')
        ?.classList.remove('icon-warning');
      document
        .querySelector('.ant-modal-close-icon')
        ?.classList.remove('icon-danger');
      document
        .querySelector('.ant-modal-close-icon')
        ?.classList.remove('icon-success');
      document
        .querySelector('.ant-modal-header')
        ?.classList.remove('modal-info');
      document
        .querySelector('.ant-modal-header')
        ?.classList.remove('modal-warning');
      document
        .querySelector('.ant-modal-header')
        ?.classList.remove('modal-danger');
      document
        .querySelector('.ant-modal-header')
        ?.classList.remove('modal-success');
    };
  }, [props.open]);

  console.log('props', props)

  return <Modal {...props}>{children}</Modal>;
}
