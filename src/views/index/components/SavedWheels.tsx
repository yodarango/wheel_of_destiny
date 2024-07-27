import { useWheelContext } from "../../../context/WheelContextProvider";
import { TSlice } from "../../../types";
import "./SavedWheels.scss";

export const SavedWheels = () => {
  const {
    state: { savedSlices: slices },
    handleToggleShowWheelsList: onClose,
    handleSelectASavedWheel: onSelect,
    handleRemoveWheel: onRemove,
  } = useWheelContext();

  const slicesList = Object.keys(slices) as any;

  return (
    <section className='slices-container'>
      <div className='p-4 bg-beta'>
        <div className='d-flex align-items-center justify-content-end mb-4'>
          <button className='bg-nu p-0 m-0' onClick={onClose}>
            <span className='icon icon-close-outline color-alpha' />
          </button>
        </div>
        <div>
          {slicesList.map((slice: keyof typeof slices) => {
            const currentSlice: TSlice = slices[slice];
            return (
              <div
                key={slice}
                className='p-4 d-flex align-items-center justify-content-start gap-4 mb-2 rounded bg-gamma'
              >
                <h4 className='slice-title w-100 m-0'>{currentSlice.title}</h4>
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
        </div>
      </div>
    </section>
  );
};
