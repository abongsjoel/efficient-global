import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import Button from "../atoms/Button";

type ImageSize = {
  height: number;
  width: number;
};

type ImageRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type CropCircle = {
  size: number;
  x: number;
  y: number;
};

type DragState =
  | {
      pointerId: number;
      startCircle: CropCircle;
      startX: number;
      startY: number;
      type: "move";
    }
  | {
      pointerId: number;
      startCircle: CropCircle;
      startX: number;
      startY: number;
      type: "resize";
    };

type ProfileImageCropModalProps = {
  imageUrl: string;
  isSaving?: boolean;
  onCancel: () => void;
  onCrop: (profileImage: string) => void;
};

const cropOutputSize = 512;
const fallbackStageSize = 320;
const minCropCircleSize = 72;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const LoadingSpinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
  />
);

const getRenderedImageRect = (
  imageSize: ImageSize,
  stageSize: number,
): ImageRect => {
  const imageAspectRatio = imageSize.width / imageSize.height;

  if (imageAspectRatio >= 1) {
    const height = stageSize / imageAspectRatio;

    return {
      height,
      left: 0,
      top: (stageSize - height) / 2,
      width: stageSize,
    };
  }

  const width = stageSize * imageAspectRatio;

  return {
    height: stageSize,
    left: (stageSize - width) / 2,
    top: 0,
    width,
  };
};

const getInitialCropCircle = (imageRect: ImageRect): CropCircle => {
  const size = Math.max(
    minCropCircleSize,
    Math.min(imageRect.width, imageRect.height) * 0.68,
  );

  return {
    size,
    x: imageRect.left + (imageRect.width - size) / 2,
    y: imageRect.top + (imageRect.height - size) / 2,
  };
};

const constrainCropCircle = (
  circle: CropCircle,
  imageRect: ImageRect,
): CropCircle => {
  const maxSize = Math.min(imageRect.width, imageRect.height);
  const size = clamp(circle.size, minCropCircleSize, maxSize);

  return {
    size,
    x: clamp(circle.x, imageRect.left, imageRect.left + imageRect.width - size),
    y: clamp(circle.y, imageRect.top, imageRect.top + imageRect.height - size),
  };
};

const ProfileImageCropModal = ({
  imageUrl,
  isSaving = false,
  onCancel,
  onCrop,
}: ProfileImageCropModalProps) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [cropCircle, setCropCircle] = useState<CropCircle | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [error, setError] = useState("");
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [stageSize, setStageSize] = useState(fallbackStageSize);

  const imageRect = imageSize
    ? getRenderedImageRect(imageSize, stageSize)
    : null;
  const constrainedCropCircle =
    cropCircle && imageRect
      ? constrainCropCircle(cropCircle, imageRect)
      : null;

  const resetCropCircle = useCallback(
    (nextImageSize: ImageSize, nextStageSize = stageSize) => {
      const nextImageRect = getRenderedImageRect(nextImageSize, nextStageSize);
      setCropCircle(getInitialCropCircle(nextImageRect));
    },
    [stageSize],
  );

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const updateStageSize = () => {
      const nextStageSize = stage.clientWidth || fallbackStageSize;
      setStageSize(nextStageSize);
      setCropCircle((currentCircle) => {
        if (!imageSize || !currentCircle) {
          return currentCircle;
        }

        return constrainCropCircle(
          currentCircle,
          getRenderedImageRect(imageSize, nextStageSize),
        );
      });
    };

    updateStageSize();

    const resizeObserver = new ResizeObserver(updateStageSize);
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, [imageSize]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onCancel();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSaving, onCancel]);

  const handleImageLoad = () => {
    const image = imageRef.current;

    if (!image) {
      return;
    }

    const nextImageSize = {
      height: image.naturalHeight || image.height,
      width: image.naturalWidth || image.width,
    };

    setError("");
    setImageSize(nextImageSize);
    resetCropCircle(nextImageSize);
  };

  const handleMovePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!constrainedCropCircle || isSaving) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      pointerId: event.pointerId,
      startCircle: constrainedCropCircle,
      startX: event.clientX,
      startY: event.clientY,
      type: "move",
    });
  };

  const handleResizePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!constrainedCropCircle || isSaving) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      pointerId: event.pointerId,
      startCircle: constrainedCropCircle,
      startX: event.clientX,
      startY: event.clientY,
      type: "resize",
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !dragState ||
      dragState.pointerId !== event.pointerId ||
      !imageRect
    ) {
      return;
    }

    if (dragState.type === "move") {
      setCropCircle(
        constrainCropCircle(
          {
            ...dragState.startCircle,
            x: dragState.startCircle.x + event.clientX - dragState.startX,
            y: dragState.startCircle.y + event.clientY - dragState.startY,
          },
          imageRect,
        ),
      );
      return;
    }

    const delta = Math.max(
      event.clientX - dragState.startX,
      event.clientY - dragState.startY,
    );
    const nextSize = dragState.startCircle.size + delta;

    setCropCircle(
      constrainCropCircle(
        {
          ...dragState.startCircle,
          size: nextSize,
        },
        imageRect,
      ),
    );
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    setDragState(null);
  };

  const handleCrop = () => {
    const image = imageRef.current;

    if (!image || !imageSize || !imageRect || !constrainedCropCircle) {
      setError("We could not prepare that image.");
      return;
    }

    const sourceX =
      ((constrainedCropCircle.x - imageRect.left) / imageRect.width) *
      imageSize.width;
    const sourceY =
      ((constrainedCropCircle.y - imageRect.top) / imageRect.height) *
      imageSize.height;
    const sourceSize =
      (constrainedCropCircle.size / imageRect.width) * imageSize.width;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      setError("We could not prepare that image.");
      return;
    }

    canvas.width = cropOutputSize;
    canvas.height = cropOutputSize;
    context.drawImage(
      image,
      clamp(sourceX, 0, imageSize.width - sourceSize),
      clamp(sourceY, 0, imageSize.height - sourceSize),
      sourceSize,
      sourceSize,
      0,
      0,
      cropOutputSize,
      cropOutputSize,
    );

    onCrop(canvas.toDataURL("image/jpeg", 0.86));
  };

  return (
    <div
      aria-labelledby="profile-image-crop-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 py-10"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onCancel();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
              Profile photo
            </p>
            <h2
              id="profile-image-crop-title"
              className="mt-2 text-2xl font-bold tracking-tight"
            >
              Crop photo
            </h2>
          </div>

          <Button
            aria-label="Close"
            className="h-8 w-8 rounded-full p-0 text-slate-500 hover:text-slate-800"
            disabled={isSaving}
            size="sm"
            type="button"
            variant="link"
            onClick={onCancel}
          >
            <CloseIcon />
          </Button>
        </div>

        <div
          ref={stageRef}
          className="relative mt-6 aspect-square w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img
            ref={imageRef}
            alt=""
            className="h-full w-full select-none object-contain"
            draggable={false}
            src={imageUrl}
            onError={() => setError("We could not read that image.")}
            onLoad={handleImageLoad}
          />

          {!constrainedCropCircle ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-500">
              Loading image...
            </div>
          ) : (
            <div
              className="absolute rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.42),0_10px_30px_rgba(15,23,42,0.2)]"
              style={{
                height: `${constrainedCropCircle.size}px`,
                left: `${constrainedCropCircle.x}px`,
                top: `${constrainedCropCircle.y}px`,
                width: `${constrainedCropCircle.size}px`,
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
              >
                <span className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-white/80 shadow-[0_0_3px_rgba(15,23,42,0.65)]" />
                <span className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-white/80 shadow-[0_0_3px_rgba(15,23,42,0.65)]" />
              </div>
              <div
                aria-label="Move crop area"
                className="absolute inset-0 cursor-move rounded-full"
                role="button"
                tabIndex={0}
                onPointerDown={handleMovePointerDown}
              />
              <button
                aria-label="Resize crop area"
                className="absolute bottom-2 right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-white bg-primary-200 shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/30"
                type="button"
                onPointerDown={handleResizePointerDown}
              />
            </div>
          )}
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            disabled={isSaving}
            type="button"
            variant="inverse"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={!constrainedCropCircle || isSaving}
            type="button"
            onClick={handleCrop}
          >
            {isSaving ? <LoadingSpinner /> : null}
            Save photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCropModal;
