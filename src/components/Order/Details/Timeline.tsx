import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { Typography } from '@mui/material';

type LogTimelineProps = {
    
};

const LogTimeline:React.FC<LogTimelineProps> = () => {
    
    return (
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
          }}
        >
            <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    <Typography variant="body1">February 15</Typography>
                    <Typography variant="body2">9:15 am</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{`Stephen Pelagio archived this order.`}</TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    <Typography variant="body1">December 27</Typography>
                    <Typography variant="body2">12:36 pm</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{`Wear Godspeed (deleted) sent a local delivery delivered SMS to Jieun Yoon (+1 778-875-6857).`}</TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    <Typography variant="body1">December 2</Typography>
                    <Typography variant="body2">12:21 am</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{`Confirmation #8X9W4YGCW was generated for this order.`}</TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    <Typography variant="body1">December 1</Typography>
                    <Typography variant="body2">12:15 am</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>{`Jieun Yoon placed this order on Online Store (checkout #26948687659180).`}</TimelineContent>
            </TimelineItem>

        </Timeline>
    );
}
export default LogTimeline;