import { TSavedSlices, TSlice } from "../../../types";
import "./SavedWheels.scss";
import React from "react";

type SavedWheelsProps = {
  onSelect: (selectedSlice: TSlice) => void;
  onRemove: (id: string) => void;
  slices: TSavedSlices;
  onClose: () => void;
};

export const SavedWheels: React.FC<SavedWheelsProps> = ({
  slices,
  onClose,
  onSelect,
  onRemove,
}) => {
  const slicesList = Object.keys(slices);

  return (
    <section className='slices-container'>
      <div className='p-4 bg-beta'>
        <div className='d-flex align-items-center justify-content-end mb-4'>
          <button className='bg-nu p-0 m-0' onClick={onClose}>
            <span className='icon icon-close-outline color-alpha' />
          </button>
        </div>
        <div>
          {slicesList.map((slice) => (
            <div
              key={slice}
              className='p-4 d-flex align-items-center justify-content-start gap-4 mb-2 rounded bg-gamma'
            >
              <h4 className='slice-title w-100 m-0'>{slices[slice].title}</h4>
              <p className='flex-shrink-0 m-0'>
                slices {slices[slice].slices.length}
              </p>
              <div className='d-flex align-items-center justify-content-start gap-2 flex-shrink-0'>
                <button
                  className='bg-epsilon p-1 flex-shrink-0'
                  onClick={() =>
                    onSelect({
                      themeId: slices[slice].themeId,
                      slices: slices[slice].slices,
                      colors: slices[slice].colors,
                      title: slices[slice].title,
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
          ))}
        </div>
      </div>
    </section>
  );
};
