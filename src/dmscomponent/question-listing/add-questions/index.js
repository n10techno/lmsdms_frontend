import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  List,
  ListItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import TinyMCEEditorDialog from "./question-dialog/index.js"; // Import the new dialog component
import { useCreateTrainingQuestionMutation } from "apilms/questionApi.js";

function AddQuestion() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [answers, setAnswers] = useState([{ text: "", isCorrect: false }]);
  const [questionMarks, setQuestionMarks] = useState("");
  const [questionLanguage, setQuestionLanguage] = useState("");
  const [status, setStatus] = useState("Active");
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [createdBy, setCreatedBy] = useState(""); // Replace with actual user info if needed
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const location = useLocation();
  const id = location?.state?.id || null;
  const navigate = useNavigate();
  const [createTrainingQuestion, { isLoading }] = useCreateTrainingQuestionMutation();

  const handleAddAnswer = () => {
    if (answers.length < 6 && questionType !== "True/False") {
      setAnswers([...answers, { text: "", isCorrect: false }]);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = value;
    setAnswers(updatedAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
  };

  const handleCorrectAnswerChange = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers.forEach((answer, i) => (answer.isCorrect = false)); // Reset all answers to incorrect
    updatedAnswers[index].isCorrect = true; // Set the selected answer as correct
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!questionText.trim()) {
      toast.error("Question text is required.");
      return;
    }

    if (!questionType) {
      toast.error("Please select a question type.");
      return;
    }

    if (!questionMarks) {
      toast.error("Please enter question marks.");
      return;
    }

    if (!questionLanguage) {
      toast.error("Please select a question language.");
      return;
    }

    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    if (questionType === "MCQ") {
      if (answers.length < 2) {
        toast.error("MCQ must have at least two answers.");
        return;
      }

      const isAnyAnswerChecked = answers.some((answer) => answer.isCorrect);
      if (!isAnyAnswerChecked) {
        toast.error("Please select at least one correct answer for MCQ.");
        return;
      }

      const isAnyAnswerEmpty = answers.some((answer) => !answer.text.trim());
      if (isAnyAnswerEmpty) {
        toast.error("All answer fields must be filled.");
        return;
      }
    }

    if (questionType === "True/False" && !answers[0]?.text) {
      toast.error("Please select a correct answer for True/False.");
      return;
    }

    if (questionType === "Fill in the blank" && !answers[0]?.text.trim()) {
      toast.error("Answer cannot be empty for Fill in the blank.");
      return;
    }

    setOpenSignatureDialog(true);
  };
  const handleQuestionTypeChange = (event) => {
    const newType = event.target.value;
    setQuestionType(newType);
  
    // Reset answers based on question type
    if (newType === "MCQ") {
      setAnswers([{ text: "", isCorrect: false }]); 
    } else if (newType === "True/False") {
      setAnswers([{ text: "True", isCorrect: false }, { text: "False", isCorrect: false }]);
    } else if (newType === "Fill in the blank") {
      setAnswers([{ text: "", isCorrect: true }]); 
    }
  };
  
  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false);

    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    const formData = new FormData();
    formData.append("document_id", id);
    formData.append("question_text", questionText);
    formData.append("question_type", questionType);
    formData.append("marks", questionMarks);
    formData.append("status", status);
    formData.append("createdAt", createdAt);
    formData.append("createdBy", createdBy);

    let options = null;
    let correct_answer = null;

    if (questionType === "MCQ") {
      options = answers.map((answer) => answer.text).join(",");
      correct_answer = answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.text)
        .join(",");
    } else if (questionType === "True/False") {
      options = "True,False";
      correct_answer = answers[0]?.text;
    } else if (questionType === "Fill in the blank") {
      options = "";
      correct_answer = answers[0]?.text;
    }
    formData.append("options", options ? options : "");
    formData.append("correct_answer", correct_answer ? correct_answer : "");
    if (mediaFile) {
      const fileType = mediaFile.type;
      if (fileType.startsWith("image")) {
        formData.append("image_file_url", mediaFile);
      } else if (fileType.startsWith("audio")) {
        formData.append("audio_file_url", mediaFile);
      } else if (fileType.startsWith("video")) {
        formData.append("video_file_url", mediaFile);
      } else {
        toast.error("Unsupported file type. Please upload an image, audio, or video.");
        return;
      }
    }
    try {
      const response = await createTrainingQuestion(formData).unwrap();
      toast.success("Question created successfully!");
      setTimeout(() => {
        navigate("/trainingListing");
      }, 1500);
    } catch (error) {
      toast.error("Failed to create question. Please try again.");
    } finally {
      setOpenSignatureDialog(false);
    }
  };
  const handleOpenQuestionDialog = () => {
    setOpenQuestionDialog(true);
  };
  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
  };
  const handleOpenAnswerDialog = (index) => {
    setCurrentAnswerIndex(index);
    setOpenAnswerDialog(true);
  };
  const handleCloseAnswerDialog = () => {
    setOpenAnswerDialog(false);
  };
  const handleSaveQuestion = (content) => {
    setQuestionText(content);
  };
  const handleSaveAnswer = (content) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentAnswerIndex].text = content;
    setAnswers(updatedAnswers);
  };
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
  };
  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto", mt: 5, mb: 5 }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)",
            borderRadius: "lg",
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Add Question
          </MDTypography>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Add Question"
                fullWidth
                value={questionText}
                onClick={handleOpenQuestionDialog}
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-question-type-label">Question Type</InputLabel>
                <Select
                  labelId="select-question-type-label"
                  id="select-question-type"
                  value={questionType}
                  onChange={handleQuestionTypeChange} 
                  input={<OutlinedInput label="Question Type" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  <MenuItem value="Fill in the blank">Fill in the blank</MenuItem>
                  <MenuItem value="MCQ">MCQ</MenuItem>
                  <MenuItem value="True/False">True/False</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Add Answers
              </MDTypography>
              {questionType === "Fill in the blank" && (
                <MDInput
                  type="text"
                  placeholder="Answer"
                  value={answers[0]?.text}
                  onChange={(e) => handleAnswerChange(0, e.target.value)}
                  fullWidth
                />
              )}
              {questionType === "MCQ" && (
                <List>
                  {answers.map((answer, index) => (
                    <ListItem key={index}>
                      <MDInput
                        type="text"
                        placeholder={`Answer ${index + 1}`}
                        value={answer.text}
                        onClick={() => handleOpenAnswerDialog(index)}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        sx={{ flex: 1, marginRight: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={answer.isCorrect}
                            onChange={() => handleCorrectAnswerChange(index)}
                          />
                        }
                       
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveAnswer(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
              {questionType === "True/False" && (
                <RadioGroup>
                  <FormControlLabel
                    value="True"
                    control={<Radio />}
                    label="True"
                    checked={answers[0]?.text === "True"}
                    onChange={() => handleAnswerChange(0, "True")}
                  />
                  <FormControlLabel
                    value="False"
                    control={<Radio />}
                    label="False"
                    checked={answers[0]?.text === "False"}
                    onChange={() => handleAnswerChange(0, "False")}
                  />
                </RadioGroup>
              )}
              {questionType !== "True/False" && questionType !== "Fill in the blank" && (
                <MDButton variant="outlined" color="success" onClick={handleAddAnswer}>
                  Add Answer
                </MDButton>
              )}
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Question Marks"
                fullWidth
                value={questionMarks}
                onChange={(e) => setQuestionMarks(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-language-label">Question Language</InputLabel>
                <Select
                  labelId="select-language-label"
                  id="select-language"
                  value={questionLanguage}
                  onChange={(e) => setQuestionLanguage(e.target.value)}
                  input={<OutlinedInput label="Question Language" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Gujarati">Gujarati</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControl component="fieldset" fullWidth>
                <MDTypography variant="h6" fontWeight="medium">
                  Status
                </MDTypography>
                <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
                  <FormControlLabel value="Active" control={<Radio />} label="Active" />
                  <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDTypography variant="h6">Upload Media (Image/Video/Audio)</MDTypography>
              <input type="file" accept="image/*,video/*,audio/*" onChange={handleMediaChange} />
              {mediaFile && <MDTypography variant="body2">{mediaFile.name}</MDTypography>}
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        onClose={() => setOpenSignatureDialog(false)}
        onConfirm={handleSignatureComplete}
      />
      {/* Question Edit Dialog */}
      <TinyMCEEditorDialog
        open={openQuestionDialog}
        onClose={handleCloseQuestionDialog}
        title="Add Question"
        content={questionText}
        onSave={handleSaveQuestion}
      />
      {/* Answer Edit Dialog */}
      <TinyMCEEditorDialog
        open={openAnswerDialog}
        onClose={handleCloseAnswerDialog}
        title="Add Answer"
        content={answers[currentAnswerIndex]?.text || ""}
        onSave={handleSaveAnswer}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
}
export default AddQuestion;
