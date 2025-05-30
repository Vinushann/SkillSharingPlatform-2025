import React from "react";
import { Box, Typography, Divider, Card, CardContent } from "@mui/material";

// Utility to extract YouTube video ID and return embed URL
const getYouTubeEmbedURL = (url) => {
  const regex =
    /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const PreviewPlanSub = ({ planData }) => {
  if (!planData || !planData.mainTitle) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {planData.mainTitle}
      </Typography>

      {[1, 2, 3, 4].map((num) => {
        const name = planData[`sub${num}Name`];
        const duration = planData[`sub${num}Duration`];
        const resource = planData[`sub${num}Resource`];
        const completed = planData[`sub${num}Completed`];

        if (!name && !duration && !resource) return null;

        const embedURL = getYouTubeEmbedURL(resource);

        return (
          <Card key={num} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {name || `Subtopic ${num}`}
              </Typography>
              {duration && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Duration:</strong> {duration}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Completed:</strong> {completed ? "Yes ✅" : "No ❌"}
              </Typography>
              {embedURL && (
                <Box mt={2}>
                  <iframe
                    width="100%"
                    height="280"
                    src={embedURL}
                    title={`YouTube video for Subtopic ${num}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default PreviewPlanSub;
