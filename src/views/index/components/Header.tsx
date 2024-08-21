import { useWheelContext } from "../../../context/WheelContextProvider";
import "./Header.scss";

const WHEEL_STATUS_UNSAVED = 1;
const WHEEL_STATUS_SAVED = 2;
const WHEEL_STATUS_UPDATING = 3;

export const Header = () => {
  const ctx = useWheelContext();
  const {
    state: { wheelStatus, wheelTitle, currentWheelId },
    handleToggleShowWheelsList: onShowFolders,
    handleCreateNewWheel: onCreateNew,
    handleRemoveWheel: onRemove,
    handleSave: onSave,
  } = ctx;

  const showAddNew = wheelStatus === WHEEL_STATUS_SAVED;

  return (
    <div className='pb-1 wheel-of-destiny-33kl__nav-bar'>
      <div className='bg-gamma p-4 w-100'>
        <div className='nav-bar__container d-flex align-items-center justify-content-center gap-4'>
          <div className='d-flex align-items-center justify-content-start gap-2'>
            {wheelStatus === WHEEL_STATUS_UNSAVED ? (
              <>
                <button
                  className='bg-success p-1 flex-shrink-0 color-beta'
                  onClick={onSave}
                >
                  <ion-icon name='save-outline' />
                </button>
                <p className='white-space-nowrap'>Save</p>
              </>
            ) : wheelStatus === WHEEL_STATUS_SAVED ? (
              <>
                <button
                  className='p-1 flex-shrink-0 bg-danger color-alpha'
                  onClick={() => onRemove(currentWheelId)}
                >
                  <ion-icon name='trash-outline' />
                </button>
                <p className='white-space-nowrap'>Delete</p>
              </>
            ) : wheelStatus === WHEEL_STATUS_UPDATING ? (
              <>
                <button
                  className=' p-1 flex-shrink-0 bg-zeta color-alpha'
                  onClick={onSave}
                >
                  <ion-icon name='save-outline' />
                </button>
                <p className='white-space-nowrap'>Save changes</p>
              </>
            ) : null}
          </div>

          <div
            className='d-flex align-items-center justify-content-start gap-2'
            id='nav-bar-33kl__wheels-saved'
          >
            <button
              className='bg-zeta p-1 flex-shrink-0 color-alpha'
              onClick={onShowFolders}
            >
              <ion-icon name='folder-outline' />
            </button>
            <p className='white-space-nowrap'>My wheels</p>
          </div>

          <h2
            id='nav-bar-33kl__wheel-name'
            className='nav-bar-33kl__wheel-name text-center w-100'
          >
            {wheelTitle}
          </h2>

          {showAddNew && (
            <div className='d-flex align-items-center justify-content-start gap-2'>
              <button
                className='bg-delta p-1 flex-shrink-0'
                onClick={onCreateNew}
              >
                <ion-icon name='add-outline' />
              </button>
              <p className='white-space-nowrap'>Add new</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
