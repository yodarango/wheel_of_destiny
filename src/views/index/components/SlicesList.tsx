import React from "react";
import "./SlicesList.scss";

type SlicesListProps = {
  slices: { [key: string]: { title: string; slices: string[] } };
  onClose: () => void;
  onSelect: (selectedSlice: {
    slices: string[];
    title: string;
    id: string;
  }) => void;
};

export const SlicesList: React.FC<SlicesListProps> = ({
  slices,
  onClose,
  onSelect,
}) => {
  const slicesList = Object.keys(slices);

  return (
    <section className='slices-container'>
      <div className='p-4 bg-beta'>
        <div className='d-flex align-items-center justify-content-end mb-4'>
          <button className='bg-nu p-0 m-0' onClick={onClose}>
            Close
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
                  className='btn primary p-1 flex-shrink-0'
                  onClick={() =>
                    onSelect({
                      slices: slices[slice].slices,
                      title: slices[slice].title,
                      id: slice,
                    })
                  }
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
