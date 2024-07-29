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
                  className='bg-success p-1 flex-shrink-0'
                  onClick={onSave}
                >
                  <span className='icon icon-save-outline color-beta'></span>
                </button>
                <p className='white-space-nowrap'>Save</p>
              </>
            ) : wheelStatus === WHEEL_STATUS_SAVED ? (
              <>
                <button
                  className='p-1 flex-shrink-0 bg-danger'
                  onClick={() => onRemove(currentWheelId)}
                >
                  <span className='icon icon-trash-outline color-alpha'></span>
                </button>
                <p className='white-space-nowrap'>Delete</p>
              </>
            ) : wheelStatus === WHEEL_STATUS_UPDATING ? (
              <>
                <button className=' p-1 flex-shrink-0 bg-zeta' onClick={onSave}>
                  <span className='icon icon-save-outline color-alpha'></span>
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
              className='bg-zeta p-1 flex-shrink-0'
              onClick={onShowFolders}
            >
              <span className='icon icon-folder-outline color-alpha'></span>
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
                <span className='icon icon-add-outline'></span>
              </button>
              <p className='white-space-nowrap'>Add new</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
