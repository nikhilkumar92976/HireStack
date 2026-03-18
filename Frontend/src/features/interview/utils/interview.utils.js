export const initialFormData = {
  jobTitle: "",
  selfDescription: "",
  jobDescription: "",
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const getQuestionsFromPayload = (payload) => {
  const possibleCollections = [
    payload?.technicalQuestions,
    payload?.technicalQuestions?.technicalQuestions,
    payload?.interviewQuestion?.technicalQuestions,
    payload?.interviewQuestion?.technicalQuestions?.technicalQuestions,
    payload,
  ];

  const questionList = possibleCollections.find(
    (value) => Array.isArray(value) && value.length > 0
  );

  if (!Array.isArray(questionList)) {
    return [];
  }

  return questionList.filter((item) => item?.question);
};

export const getResultDetails = (report) => report?.matchScore || {};