import { useNavigate } from "react-router-dom";
import InterviewCameraPanel from "../components/InterviewCameraPanel";
import InterviewHeader from "../components/InterviewHeader";
import InterviewResults from "../components/InterviewResults";
import InterviewSessionPanel from "../components/InterviewSessionPanel";
import InterviewSetupForm from "../components/InterviewSetupForm";
import { useInterviewSession } from "../hooks/useInterviewSession";

export default function InterviewPage() {
  const navigate = useNavigate();
  const session = useInterviewSession();

  return (
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <InterviewHeader
          stage={session.stage}
          questionCount={session.questions.length}
          onBack={() => navigate("/")}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
          <div className="space-y-6">
            {session.stage === "setup" && (
              <InterviewSetupForm
                formData={session.formData}
                errors={session.errors}
                loading={session.loading}
                sessionError={session.sessionError}
                onChange={session.handleFormChange}
                onSubmit={session.handleStartSession}
              />
            )}

            {session.stage === "interview" && (
              <InterviewSessionPanel
                currentQuestion={session.currentQuestion}
                currentIndex={session.currentIndex}
                questionCount={session.questions.length}
                answeredQuestions={session.answeredQuestions}
                elapsedSeconds={session.elapsedSeconds}
                isSpeaking={session.isSpeaking}
                isRecording={session.isRecording}
                loading={session.loading}
                draftAnswer={session.draftAnswer}
                sessionError={session.sessionError}
                recordingUrl={session.recordings[session.currentIndex]}
                onAnswerChange={session.setDraftAnswer}
                onReplay={session.handleReplayQuestion}
                onStartRecording={session.handleStartRecording}
                onStopRecording={session.stopVoiceCapture}
                onAdvance={session.handleAdvance}
              />
            )}

            {session.stage === "result" && (
              <InterviewResults
                result={session.result}
                resultDetails={session.resultDetails}
                responses={session.responses}
                questions={session.questions}
                elapsedSeconds={session.elapsedSeconds}
                jobTitle={session.formData.jobTitle}
                onReset={session.handleReset}
                onBack={() => navigate("/")}
              />
            )}
          </div>

          <InterviewCameraPanel
            videoRef={session.videoRef}
            stage={session.stage}
            cameraActive={session.cameraActive}
            permissionError={session.permissionError}
            supportsSpeechSynthesis={session.supportsSpeechSynthesis}
            supportsSpeechRecognition={session.supportsSpeechRecognition}
          />
        </div>
      </div>
    </div>
  );
}