import { Camera, Circle } from "lucide-react";

const MiniTip = ({ title, description }) => (
  <div className="rounded-2xl border border-gray-200 p-4">
    <p className="font-medium text-gray-900">{title}</p>
    <p className="mt-1 text-xs text-gray-500">{description}</p>
  </div>
);

export default function InterviewCameraPanel({
  videoRef,
  stage,
  cameraActive,
  permissionError,
  supportsSpeechSynthesis,
  supportsSpeechRecognition,
}) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="font-semibold text-gray-900">Live interview camera</h3>
            <p className="text-xs text-gray-500">Your webcam stays active during the interview.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Circle size={10} className={stage === "interview" ? "fill-red-500 text-red-500" : "text-gray-300"} />
            {stage === "interview" ? "Live" : "Standby"}
          </div>
        </div>

        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-center text-white">
              <Camera size={32} />
              <div>
                <p className="font-medium">Camera preview is waiting</p>
                <p className="text-sm text-gray-300">
                  The interview can start even if camera permission is delayed or blocked.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 px-5 py-4 text-sm text-gray-600">
          {permissionError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {permissionError}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              {stage === "interview"
                ? "Maintain eye contact with the camera and answer naturally for the most realistic experience."
                : "Camera and microphone will be requested for the live interview preview, but they no longer block the start button."}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <MiniTip
              title="Auto voice questions"
              description={
                supportsSpeechSynthesis
                  ? "Enabled for this browser."
                  : "Not supported here, but questions still appear on screen."
              }
            />
            <MiniTip
              title="Voice transcript"
              description={
                supportsSpeechRecognition
                  ? "Your spoken answer is transcribed live."
                  : "Use manual typing/editing when speech recognition is unavailable."
              }
            />
          </div>
        </div>
      </div>
    </aside>
  );
}