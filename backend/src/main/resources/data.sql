-- -- Insert the plan (no ID provided)
-- INSERT INTO learning_plan (title, is_template) VALUES ('Frontend Development Learning', true);

-- -- Let MySQL assign subtopic IDs AND dynamically grab the plan ID
-- SET @planId = LAST_INSERT_ID();

-- INSERT INTO learning_sub_topic (name, description, duration, resource, learning_plan_id) VALUES
-- ('HTML & CSS Basics', 'Learn the building blocks of the web.', 3, 'https://www.youtube.com/embed/UB1O30fR-EE', @planId),
-- ('Responsive Design', 'Make your website look great on all devices.', 2, 'https://www.youtube.com/embed/srvUrASNj0s', @planId),
-- ('JavaScript Fundamentals', 'Add interactivity using JS basics.', 4, 'https://www.youtube.com/embed/W6NZfCO5SIk', @planId),
-- ('DOM Manipulation', 'Modify content dynamically using JavaScript.', 3, 'https://www.youtube.com/embed/0ik6X4DJKCc', @planId),
-- ('React Basics', 'Build UI with reusable components in React.', 5, 'https://www.youtube.com/embed/bMknfKXIFA8', @planId);
