import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Tem certeza?',
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  icon,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>{cancelText}</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
        </>
      }
    >
      <div className="confirm-dialog">
        {icon && <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>{icon}</div>}
        <p className="confirm-dialog__text">{description}</p>
      </div>
    </Modal>
  );
}