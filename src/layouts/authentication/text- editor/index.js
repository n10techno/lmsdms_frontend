import React, { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import Mammoth from "mammoth";
import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import { useGetTemplateOnIdQuery } from "api/auth/texteditorApi";

// Register the ImageResize module
Quill.register("modules/imageResize", ImageResize);

// Toolbar options for the editor
const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", "normal", "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image", "video", "blockquote", "hr", "formula"],
  ["clean"],
  [{ indent: "-1" }, { indent: "+1" }],
  ["code-block"],
  ["comment"],
];

const DocumentView = () => {
  const [docContent, setDocContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const quillRef = useRef(null);
  
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const [comments, setComments] = useState([]);
  const location = useLocation();
  const { templateId } = location.state || {}; 
  
  
  // Fetch template from the API
  const { data, error, isLoading } = useGetTemplateOnIdQuery(templateId);
  console.log("Template ID passed:", templateId);

  useEffect(() => {
    if (data && data.document_url) {
      // Fetch the document as an array buffer
      fetch(data.document_url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          // Convert DOCX to HTML
          Mammoth.convertToHtml({ arrayBuffer }).then((result) => {
            setDocContent(result.value);
            setIsLoaded(true);
          }).catch((err) => {
            console.error("Error converting DOCX to HTML:", err);
            setIsLoaded(true);
          });
        })
        .catch(err => {
          console.error("Error fetching the document:", err);
          setIsLoaded(true);
        });
    }
  }, [data]);

  useEffect(() => {
    if (isLoaded && !quillRef.current) {
      const quill = new Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              comment: () => handleAddComment(),
            },
          },
          imageResize: {},
        },
      });

      quillRef.current = quill;
      quill.clipboard.dangerouslyPasteHTML(docContent);

      // Apply existing comments
      comments.forEach(({ range }) => {
        quill.formatText(range.index, range.length, { background: "yellow" });
      });

      // Add event listener for video embedding
      const videoButton = document.querySelector(".ql-video");
      if (videoButton) {
        videoButton.addEventListener("click", () => {
          const videoUrl = prompt("Enter video URL");
          if (videoUrl) {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "video", videoUrl);
          }
        });
      }

      // Customize the comment button icon
      const commentButton = document.querySelector(".ql-comment");
      if (commentButton) {
        commentButton.innerHTML = "💬";
      }
    }
  }, [isLoaded, docContent, comments]);

  const handleAddComment = () => {
    const quill = quillRef.current;
    const range = quill.getSelection();

    if (range) {
      setSelectedRange(range);
      setOpenDrawer(true);
    } else {
      alert("Please select text to add a comment.");
    }
  };

  const handleSaveComment = () => {
    if (currentComment.trim() === "") return;

    const quill = quillRef.current;
    quill.formatText(selectedRange.index, selectedRange.length, { background: "yellow" });
    setComments([...comments, { range: selectedRange, comment: currentComment }]);
    setCurrentComment("");
    setOpenDrawer(false);
  };

  const handlePrint = () => {
    const content = quillRef.current.root.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #fff;
              width: 210mm; /* A4 width */
              height: 297mm; /* A4 height */
              overflow: hidden; /* Hide overflow */
            }
          </style>
        </head>
        <body>
          ${content} <!-- Insert the editor content here -->
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleSaveDraft = () => {
    const content = quillRef.current.root.innerHTML;
    console.log("Draft saved:", content);
    alert("Draft saved!");
  };

  const handleView = () => {
    alert("Viewing the document!");
  };

  if (isLoading) {
    return <Box padding={2}>Loading document...</Box>; // Show loading indicator
  }

  if (error) {
    return <Box padding={2}>Error loading document</Box>;
  }

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", padding: 2, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Document Title
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Paper
        id="editor-container"
        sx={{
          width: "210mm",
          height: "297mm",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 1,
          overflowY: "auto",
          margin: "20px auto",
          boxShadow: 2,
        }}
      />

      {/* Comment Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 250, padding: 2, position: 'relative', height: '100%' }}>
          <IconButton onClick={() => setOpenDrawer(false)} sx={{ position: 'absolute', right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Add Comment</Typography>
          <TextField
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            rows={4}
            multiline
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSaveComment}
            sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}
            style={{
              backgroundColor: "#E53471",
              color: "white",
            }}
          >
            Save Comment
          </Button>
        </Box>
      </Drawer>

      {/* Footer with Action Buttons */}
      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={handleView} sx={{ margin: 1 }}>
          View
        </Button>
        <Button variant="contained" onClick={handleSaveDraft} sx={{ margin: 1 }}>
          Save Draft
        </Button>
        <Button variant="contained" onClick={handlePrint} sx={{ margin: 1 }}>
          Print Document
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentView;
