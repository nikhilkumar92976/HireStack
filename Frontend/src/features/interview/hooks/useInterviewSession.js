import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useInterview } from "./useInterview";
import {
  getQuestionsFromPayload,
  getResultDetails,
  initialFormData,
} from "../utils/interview.utils";

export const useInterviewSession = () => {
  const { loading, handleStartInterview, handleEndInterview } = useInterview();
  const [stage, setStage] = useState("setup");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [sessionError, setSessionError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [result, setResult] = useState(null);
  const [interviewId, setInterviewId] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [permissionError, setPermissionError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recorderStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const baseTranscriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  const audioUrlsRef = useRef([]);

  const speechRecognitionClass =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const supportsSpeechRecognition = Boolean(speechRecognitionClass);
  const supportsSpeechSynthesis =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const supportsMediaRecorder =
    typeof window !== "undefined" && "MediaRecorder" in window;

  const currentQuestion = questions[currentIndex] || null;
  const answeredQuestions = responses.filter(Boolean).length;
  const resultDetails = useMemo(() => getResultDetails(result), [result]);

  useEffect(() => {
    if (stage !== "interview") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive, stage]);

  useEffect(() => {
    if (stage !== "interview" || !currentQuestion?.question) {
      return undefined;
    }

    const savedAnswer = responses[currentIndex]?.answer || "";
    setDraftAnswer(savedAnswer);
    transcriptRef.current = savedAnswer ? `${savedAnswer.trim()} ` : "";
    baseTranscriptRef.current = savedAnswer.trim();
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";

    if (!supportsSpeechSynthesis) {
      return undefined;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `Question ${currentIndex + 1}. ${currentQuestion.question}`
    );
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [currentIndex, currentQuestion, responses, stage, supportsSpeechSynthesis]);

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  const syncDraftFromTranscript = useCallback(() => {
    const combinedTranscript = [
      baseTranscriptRef.current,
      finalTranscriptRef.current,
      interimTranscriptRef.current,
    ]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ")
      .trim();

    transcriptRef.current = combinedTranscript ? `${combinedTranscript} ` : "";
    setDraftAnswer(combinedTranscript);
    return combinedTranscript;
  }, []);

  const commitInterimTranscript = useCallback(() => {
    const interimTranscript = interimTranscriptRef.current.trim();

    if (!interimTranscript) {
      return finalTranscriptRef.current;
    }

    finalTranscriptRef.current = [
      finalTranscriptRef.current,
      interimTranscript,
    ]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ")
      .trim();

    interimTranscriptRef.current = "";
    return finalTranscriptRef.current;
  }, []);

  const finalizeVoiceCapture = useCallback(() => {
    const recorderActive = Boolean(
      recorderRef.current && recorderRef.current.state !== "inactive"
    );
    const recognitionActive = Boolean(recognitionRef.current);

    if (recorderActive || recognitionActive) {
      return;
    }

    commitInterimTranscript();
    const transcript = syncDraftFromTranscript();
    setIsProcessingVoice(false);
    setIsRecording(false);

    if (!transcript.trim()) {
      setSessionError(
        "No speech was captured. Please try recording again or type your answer manually."
      );
    }
  }, [commitInterimTranscript, syncDraftFromTranscript]);

  const requestMediaStream = async ({ required = false } = {}) => {
    if (streamRef.current) {
      return streamRef.current;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "Camera and microphone are not supported in this browser.";
      setPermissionError(message);
      if (required) {
        throw new Error(message);
      }
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      setPermissionError("");
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch((error) => {
          console.debug("Video preview play skipped", error);
        });
      }

      return stream;
    } catch (error) {
      const message =
        error?.message ||
        "Camera and microphone permission is required for the live interview view.";

      setPermissionError(message);
      if (required) {
        throw error;
      }
      return null;
    }
  };

  const stopVoiceCapture = useCallback(() => {
    const hasRecognition = Boolean(recognitionRef.current);
    const hasRecorder = Boolean(
      recorderRef.current && recorderRef.current.state !== "inactive"
    );

    if (!hasRecognition && !hasRecorder) {
      setIsProcessingVoice(false);
      setIsRecording(false);
      return;
    }

    setIsProcessingVoice(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.debug("Speech recognition stop skipped", error);
        recognitionRef.current = null;
      }
    }

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch (error) {
        console.debug("Audio recorder stop skipped", error);
        recorderRef.current = null;
      }
    }

    if (!hasRecognition && !hasRecorder) {
      finalizeVoiceCapture();
    }
  }, [finalizeVoiceCapture]);

  useEffect(() => {
    const audioUrls = audioUrlsRef.current;

    return () => {
      stopVoiceCapture();
      stopMediaStream();

      if (supportsSpeechSynthesis) {
        window.speechSynthesis.cancel();
      }

      audioUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [stopVoiceCapture, supportsSpeechSynthesis]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.jobTitle.trim()) {
      nextErrors.jobTitle = "Job title is required";
    }
    if (!formData.selfDescription.trim()) {
      nextErrors.selfDescription = "Self description is required";
    }
    if (!formData.jobDescription.trim()) {
      nextErrors.jobDescription = "Job description is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setSessionError("Please fill in all required fields before starting.");
      return false;
    }

    return true;
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSessionError("");
  };

  const handleReplayQuestion = () => {
    if (!currentQuestion?.question) {
      return;
    }

    if (!supportsSpeechSynthesis) {
      toast.info("Question playback is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Question ${currentIndex + 1}. ${currentQuestion.question}`
    );
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartRecording = async () => {
    if (!currentQuestion) {
      return;
    }

    const canCaptureAudio = supportsMediaRecorder || supportsSpeechRecognition;
    if (!canCaptureAudio) {
      const message = "Voice recording is not supported in this browser. You can still type your answer.";
      setSessionError(message);
      toast.info(message);
      return;
    }

    try {
      const stream = await requestMediaStream({ required: true });
      if (!stream) {
        return;
      }

      setSessionError("");
      setIsProcessingVoice(false);
      baseTranscriptRef.current = draftAnswer.trim();
      finalTranscriptRef.current = "";
      interimTranscriptRef.current = "";
      transcriptRef.current = draftAnswer ? `${draftAnswer.trim()} ` : "";

      if (supportsMediaRecorder && stream.getAudioTracks().length) {
        const [audioTrack] = stream.getAudioTracks();
        const recorderTrack = audioTrack.clone();
        const audioStream = new MediaStream([recorderTrack]);
        recorderStreamRef.current = audioStream;

        const preferredMimeTypes = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/mp4",
        ];
        const supportedMimeType = preferredMimeTypes.find((mimeType) =>
          window.MediaRecorder?.isTypeSupported?.(mimeType)
        );
        const mediaRecorder = supportedMimeType
          ? new MediaRecorder(audioStream, { mimeType: supportedMimeType })
          : new MediaRecorder(audioStream);
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data?.size) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          recorderStreamRef.current?.getTracks().forEach((track) => track.stop());
          recorderStreamRef.current = null;
          recorderRef.current = null;

          if (!chunksRef.current.length) {
            finalizeVoiceCapture();
            return;
          }

          const blob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });
          const url = URL.createObjectURL(blob);
          audioUrlsRef.current.push(url);

          setRecordings((previous) => {
            const previousUrl = previous[currentIndex];
            if (previousUrl) {
              URL.revokeObjectURL(previousUrl);
            }

            return { ...previous, [currentIndex]: url };
          });

          finalizeVoiceCapture();
        };

        mediaRecorder.start(250);
        recorderRef.current = mediaRecorder;
      }

      if (supportsSpeechRecognition) {
        const recognition = new speechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let capturedFinalTranscript = "";
          let capturedInterimTranscript = "";

          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const text = (event.results[index][0]?.transcript || "").trim();

            if (!text) {
              continue;
            }

            if (event.results[index].isFinal) {
              capturedFinalTranscript += `${text} `;
            } else {
              capturedInterimTranscript += `${text} `;
            }
          }

          if (capturedFinalTranscript.trim()) {
            finalTranscriptRef.current = `${finalTranscriptRef.current} ${capturedFinalTranscript}`.trim();
          }

          interimTranscriptRef.current = capturedInterimTranscript.trim();
          syncDraftFromTranscript();
        };

        recognition.onerror = (event) => {
          if (event.error === "no-speech") {
            setSessionError(
              "No speech detected. Please speak clearly or edit the answer manually."
            );
          } else if (event.error !== "aborted") {
            toast.info(
              "Live speech transcription paused. You can still edit the answer manually."
            );
          }
        };

        recognition.onend = () => {
          recognitionRef.current = null;
          commitInterimTranscript();
          syncDraftFromTranscript();
          finalizeVoiceCapture();
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      setIsRecording(true);
    } catch (error) {
      const message =
        error?.message || "Camera and microphone permission is required to record your answer.";
      console.error("Failed to start voice capture", error);
      setSessionError(message);
      toast.error(message);
    }
  };

  const saveCurrentResponse = () => {
    if (!currentQuestion) {
      return [];
    }

    const trimmedAnswer = draftAnswer.trim();
    const nextResponses = [...responses];
    nextResponses[currentIndex] = {
      question: currentQuestion.question,
      answer: trimmedAnswer,
    };

    setResponses(nextResponses);
    return nextResponses.filter(Boolean);
  };

  const handleStartSession = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSessionError("");

    try {
      const data = await handleStartInterview({
        jobTitle: formData.jobTitle.trim(),
        selfDescription: formData.selfDescription.trim(),
        jobDescription: formData.jobDescription.trim(),
      });

      const interviewReport = data?.interviewQuestion || data?.interview || data;
      const normalizedQuestions = getQuestionsFromPayload(interviewReport);

      if (!normalizedQuestions.length) {
        throw new Error("Interview questions were not returned by the API.");
      }

      setQuestions(normalizedQuestions);
      setResponses([]);
      setRecordings({});
      setCurrentIndex(0);
      setDraftAnswer("");
      setElapsedSeconds(0);
      setResult(null);
      setInterviewId(interviewReport?._id || "");
      setStage("interview");
      toast.success("Interview started. Your first question is being read aloud.");

      requestMediaStream();
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to start interview.";
      console.error("Failed to start interview", error);
      setSessionError(message);
      toast.error(message);
    }
  };

  const handleAdvance = async () => {
    if (isRecording) {
      toast.info("Stop recording before moving to the next question.");
      return;
    }

    if (isProcessingVoice) {
      toast.info("Please wait a moment while your recording is converted into text.");
      return;
    }

    if (!draftAnswer.trim()) {
      const message = "Please record or type your answer before continuing.";
      setSessionError(message);
      toast.error(message);
      return;
    }

    setSessionError("");
    const nextResponses = saveCurrentResponse();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    if (!interviewId) {
      const message = "Interview session id is missing. Please restart the interview.";
      setSessionError(message);
      toast.error(message);
      return;
    }

    try {
      const data = await handleEndInterview({
        responses: nextResponses.map(({ question, answer }) => ({ question, answer })),
        interview: interviewId,
      });

      stopMediaStream();
      setResult(data?.interview || data);
      setStage("result");
      toast.success("Interview submitted successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to submit interview.";
      console.error("Failed to submit interview", error);
      setSessionError(message);
      toast.error(message);
    }
  };

  const handleReset = () => {
    stopVoiceCapture();
    stopMediaStream();
    setStage("setup");
    setFormData(initialFormData);
    setErrors({});
    setSessionError("");
    setQuestions([]);
    setCurrentIndex(0);
    setDraftAnswer("");
    setResponses([]);
    setResult(null);
    setInterviewId("");
    setElapsedSeconds(0);
    setPermissionError("");
    setIsSpeaking(false);
    setRecordings({});
  };

  return {
    loading,
    stage,
    formData,
    errors,
    sessionError,
    questions,
    currentIndex,
    currentQuestion,
    draftAnswer,
    responses,
    result,
    resultDetails,
    elapsedSeconds,
    permissionError,
    isRecording,
    isProcessingVoice,
    isSpeaking,
    recordings,
    cameraActive,
    answeredQuestions,
    supportsSpeechRecognition,
    supportsSpeechSynthesis,
    videoRef,
    setDraftAnswer,
    handleFormChange,
    handleReplayQuestion,
    handleStartRecording,
    stopVoiceCapture,
    handleStartSession,
    handleAdvance,
    handleReset,
  };
};