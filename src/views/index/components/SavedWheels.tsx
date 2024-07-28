import { useWheelContext } from "../../../context/WheelContextProvider";
import ShroodEmpty from "../../../../public/shrood_empty.webp";
import { TSlice } from "../../../types";
import { createPortal } from "react-dom";
import "./SavedWheels.scss";

export const SavedWheels = () => {
  const {
    state: { savedSlices: slices, isShowingWheelsList },
    handleToggleShowWheelsList: onClose,
    handleSelectASavedWheel: onSelect,
    handleRemoveWheel: onRemove,
  } = useWheelContext();

  const slicesList = Object.keys(slices) as any;

  if (!isShowingWheelsList) return null;

  return createPortal(
    <>
      <section className='slices-container'>
        <div className='p-4 bg-beta'>
          <div className='d-flex align-items-center justify-content-end mb-4'>
            <button className='bg-nu p-0 m-0' onClick={onClose}>
              <span className='icon icon-close-outline color-alpha' />
            </button>
          </div>
          <div>
            {slicesList.length > 0 &&
              slicesList.map((slice: keyof typeof slices) => {
                const currentSlice: TSlice = slices[slice];
                return (
                  <div
                    key={slice}
                    className='p-4 d-flex align-items-center justify-content-start gap-4 mb-2 rounded bg-gamma'
                  >
                    <h4 className='slice-title w-100 m-0'>
                      {currentSlice.title}
                    </h4>
                    <p className='flex-shrink-0 m-0'>
                      slices {currentSlice.slices.length}
                    </p>
                    <div className='d-flex align-items-center justify-content-start gap-2 flex-shrink-0'>
                      <button
                        className='bg-epsilon p-1 flex-shrink-0'
                        onClick={() =>
                          onSelect({
                            themeId: currentSlice.themeId,
                            slices: currentSlice.slices,
                            colors: currentSlice.colors,
                            title: currentSlice.title,
                            id: slice,
                          })
                        }
                      >
                        Select
                      </button>
                      <button
                        className='bg-danger p-1 flex-shrink-0'
                        onClick={() => onRemove(slice)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            {slicesList.length === 0 && (
              <div>
                <h4 className='m-0'>Your wheels</h4>
                <img
                  src={ShroodEmpty}
                  alt='A purple rooky looking into an empty box'
                />
                <p className='m-0'>
                  You don't have any wheels saved but you can create one and
                  save it for later.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className='saved-wheels-portal-bg' onClick={onClose} />
    </>,
    document.body
  );
};
